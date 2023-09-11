import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {RetryCallError} from "../schemas/client.interfaces";
import {AuthClient} from "./auth.client";
import {HttpMethod} from "../schemas/http.method";
import {medcaseConstants} from "../../config";
import {ClientCredentials} from "../schemas";
import {ApiCallError} from "../schemas/api.call.error";

export class ApiClient {
    private authApi: AuthClient;
    private api: AxiosInstance;
    private readonly apiURL: string;

    private requestInterceptor = async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        request.headers["Authorization"] = await this.authApi.getAuthHeader();
        return request;
    };

    constructor(config: {
        clientCredentials: ClientCredentials,
    }
    ) {
        this.authApi = new AuthClient(config.clientCredentials);
        this.apiURL = config.clientCredentials.url;

        this.api = axios.create();
        this.api.interceptors.request.use(this.requestInterceptor);
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
        }) => !!error.response && error.response.status === medcaseConstants.MEDCASE_UNAUTHORIZED_STATUS;

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
                if (attempt > retries || !retryCondition(error as RetryCallError)) {
                    const axiosError = error as AxiosError;
                    throw new ApiCallError(axiosError.code, axiosError.message, JSON.stringify(axiosError.response?.data));
                }

                if (beforeRetryHook)
                    await beforeRetryHook();

                await new Promise((resolve) => setTimeout(resolve, calculateRetryDelay(attempt)));

                return makeRetryCallRec(attempt);
            }
        }

        return makeRetryCallRec();
    };
}