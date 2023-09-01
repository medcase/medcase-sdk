import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {MedcaseAuthClient} from "./auth.client";
import {ClientCredentials} from "./schemas/client.interfaces";
import {AppLogger} from "@medcase/logger-lib";
import {makeRetryCall} from "./utils/make.retry.call";
import {MedcaseClientCommand, MedcaseEnvironment} from "./schemas/client.command";
import {appConfig} from "../config";

export class MedcaseClient {
    private api: AxiosInstance;
    private medcaseAuthApi: MedcaseAuthClient;

    constructor(private clientCredentials: ClientCredentials, private logger: AppLogger) {
        this.api = axios.create();
        this.medcaseAuthApi = new MedcaseAuthClient();
        this.configRequest();
        this.configResponse();
    }

    public executeCommand = async <T>(command: MedcaseClientCommand<T>): Promise<T> => {
        const retryCall = async (): Promise<AxiosResponse> => axios[command.method]<AxiosResponse>(this.buildPath(command.env, command.path), command.body)

        const response: AxiosResponse = await this.makeRetryCallWithRefreshTokenRetryHook(retryCall)

        return command.resourceMapper(response.data);
    }

    private buildPath = (env: MedcaseEnvironment, pathSuffix: string): string =>
        `${appConfig.MEDCASE_API_URL_PREFIX}${env}${appConfig.MEDCASE_API_URL_SUFFIX}${pathSuffix}`;


    private configRequest = () => {
        this.api.interceptors.request.use(async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
            this.logger.silly("Axios request started", {method: request.method, url: request.url});

            request.headers["Authorization"] = await this.medcaseAuthApi.getAuthHeader(this.clientCredentials);

            return request;
        });
    }

    private configResponse = () => {
        this.api.interceptors.response.use((response) => {
            this.logger.silly("Axios response obtained", {url: response.headers.url, status: response.status});
            return response;
        });
    }

    private makeRetryCallWithRefreshTokenRetryHook = (retryCall: () => Promise<AxiosResponse>) => {
        const medcaseInvalidTokenRetryCondition = (error: { response: { status: number } }) => {
            const MEDCASE_UNAUTHORIZED_STATUS = 401;
            return !!error.response && error.response.status === MEDCASE_UNAUTHORIZED_STATUS;
        }

        const refreshTokenRetryHook = async () => {
            this.logger.warn("Medcase auth token was invalid, but expiration time wasn't exceeded. This should happened only in development environment after refreshing token manually");
            await this.medcaseAuthApi.refreshAuthToken(this.clientCredentials);
        }

        return makeRetryCall(
            retryCall,
            refreshTokenRetryHook,
            medcaseInvalidTokenRetryCondition,
        );
    };
}
