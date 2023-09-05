import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {MedcaseAuthClient} from "./auth.client";
import {ClientCredentials, RetryCallError} from "./schemas/client.interfaces";
import {MedcaseClientCommand} from "./schemas/client.command";
import {appConfig} from "../config";
import {AppLogger} from "@medcase/logger-lib";

const MEDCASE_UNAUTHORIZED_STATUS = 401;

export class MedcaseClient {
    private logger: AppLogger;
    private api: AxiosInstance;
    private medcaseAuthApi: MedcaseAuthClient;
    private readonly clientCredentials: ClientCredentials;
    private readonly apiUrl: string;
    private requestInterceptor = async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        this.logger.silly("Medcase SDK request started", {method: request.method, url: request.url});
        return request;
    };
    private responseInterceptor = (response: AxiosResponse) => {
        this.logger.silly("Medcase SDK response obtained", {url: response.headers.url, status: response.status});
        return response;
    };

    constructor(config: {
        clientCredentials: ClientCredentials,
        logger: AppLogger,
        testEnv?: boolean
    }) {
        this.logger = config.logger;
        this.clientCredentials = config.clientCredentials;
        this.apiUrl = config.testEnv ? appConfig.MEDCASE_STAGING_API_URL : appConfig.MEDCASE_PRODUCTION_API_URL;

        this.api = axios.create();
        this.medcaseAuthApi = new MedcaseAuthClient({
            testEnv: config.testEnv,
            clientCredentials: config.clientCredentials
        });

        this.api.interceptors.request.use(this.requestInterceptor);
        this.api.interceptors.response.use(this.responseInterceptor);
    }

    public executeCommand = async <T>(command: MedcaseClientCommand<T>): Promise<T> => {
        const authHeader: string = await this.medcaseAuthApi.getAuthHeader();
        const retryCall = async (): Promise<AxiosResponse> => axios.request<AxiosResponse>({
            method: command.method,
            url: `${this.apiUrl}${command.path}`,
            data: command.body,
            headers: {'Authorization': authHeader},
        })

        const response: AxiosResponse = await this.makeRetryCallWithRefreshTokenRetryHook(retryCall)
        return response.data.map(command.resourceMapper);
    }

    private makeRetryCallWithRefreshTokenRetryHook = (retryCall: () => Promise<AxiosResponse>) => {
        const medcaseInvalidTokenRetryCondition = (error: {
            response: { status: number }
        }) => !!error.response && error.response.status === MEDCASE_UNAUTHORIZED_STATUS;

        const refreshTokenRetryHook = async (): Promise<void> =>
            this.medcaseAuthApi.refreshAuthToken();

        const refreshTokenRetryCount = 1;

        return this.makeRetryCall(
            retryCall,
            medcaseInvalidTokenRetryCondition,
            refreshTokenRetryHook,
            refreshTokenRetryCount,
        )
    };

    private makeRetryCall = async (
        requestFunc: () => Promise<AxiosResponse>,
        retryCondition: ((error: RetryCallError) => boolean),
        beforeRetryHook?: () => Promise<void> | void,
        retries = 3,
    ): Promise<AxiosResponse> => {
        const calculateRetryDelay = (retryCount: number, multiplierInMillis = 1000) =>
            Math.pow(2, retryCount) * multiplierInMillis;

        const makeRetryCallRec = async (attempt = 0): Promise<AxiosResponse> => {
            try {
                attempt += 1;
                const result: AxiosResponse = await requestFunc();
                return result;
            } catch (error) {
                if (attempt > retries || !retryCondition(error as RetryCallError))
                    throw error;

                if (beforeRetryHook)
                    await beforeRetryHook();

                await new Promise((resolve) => setTimeout(resolve, calculateRetryDelay(attempt)));

                return makeRetryCallRec(attempt);
            }
        }

        return makeRetryCallRec();
    };
}
