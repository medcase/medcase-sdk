import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {MedcaseAuthClient} from "./auth.client";
import {ClientCredentials, RetryCallError} from "./schemas/client.interfaces";
import {AppLogger} from "@medcase/logger-lib";
import {MedcaseClientCommand} from "./schemas/client.command";
import {appConfig} from "../config";

const MEDCASE_UNAUTHORIZED_STATUS = 401;

export class MedcaseClient {
    private logger: AppLogger;
    private api: AxiosInstance;
    private medcaseAuthApi: MedcaseAuthClient;
    private readonly clientCredentials: ClientCredentials;
    private readonly apiUrl: string;

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

        this.configRequest();
        this.configResponse();
    }

    public executeCommand = async <T>(command: MedcaseClientCommand<T>): Promise<T> => {
        const retryCall = async (): Promise<AxiosResponse> => axios.request<AxiosResponse>({
            method: command.method,
            url: this.apiUrl,
            data: command.body
        })

        const response: AxiosResponse = await this.makeRetryCallWithRefreshTokenRetryHook(retryCall)
        return command.resourceMapper(response.data);
    }

    private configRequest = () => {
        this.api.interceptors.request.use(async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
            this.logger.silly("Medcase SDK request started", {method: request.method, url: request.url});

            request.headers["Authorization"] = await this.medcaseAuthApi.getAuthHeader();

            return request;
        });
    }

    private configResponse = () => {
        this.api.interceptors.response.use((response) => {
            this.logger.silly("Medcase SDK response obtained", {url: response.headers.url, status: response.status});
            return response;
        });
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
                return requestFunc();
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
