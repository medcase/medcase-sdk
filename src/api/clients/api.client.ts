import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {ClientCredentials, RetryCallError} from "../schemas/client.interfaces";
import {AuthClient} from "./auth.client";
import {AppLogger} from "@medcase/logger-lib";
import {HttpMethod} from "../schemas/http.method";
import {paths} from "../../config";

export class ApiClient {
    private authApi: AuthClient;
    private logger: AppLogger;
    private api: AxiosInstance;
    private readonly apiURL: string;

    private requestInterceptor = async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        this.logger.silly("Medcase SDK request started", {method: request.method, url: request.url});
        request.headers["Authorization"] = await this.authApi.getAuthHeader();
        return request;
    };
    private responseInterceptor = (response: AxiosResponse) => {
        this.logger.silly("Medcase SDK response obtained", {url: response.headers.url, status: response.status});
        return response;
    };

    constructor(config: {
        clientCredentials: ClientCredentials,
        logger: AppLogger
    }
    ) {
        this.authApi = new AuthClient(config.clientCredentials);
        this.logger = config.logger;
        this.apiURL = config.clientCredentials.url;

        this.api = axios.create();
        this.api.interceptors.request.use(this.requestInterceptor);
        this.api.interceptors.response.use(this.responseInterceptor);
    }

    call = async (parameters: {
        method: HttpMethod,
        path: string,
        body?: unknown
    }): Promise<AxiosResponse> => {
        const retryCall = async (): Promise<AxiosResponse> => this.api.request<AxiosResponse>({
            method: parameters.method,
            url: `${this.apiURL}${parameters.path}`,
            data: parameters.body,
        })

        const medcaseInvalidTokenRetryCondition = (error: {
            response: { status: number }
        }) => !!error.response && error.response.status === paths.MEDCASE_UNAUTHORIZED_STATUS;

        const refreshTokenRetryCount = 1;

        return this.makeRetryCall(
            retryCall,
            medcaseInvalidTokenRetryCondition,
            this.authApi.refreshAuthToken,
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