import {AuthClientCredentials, AuthRequestBody, AuthToken, ClientCredentials} from "./schemas/client.interfaces";
import axios, {AxiosResponse} from "axios";
import {appConfig} from "../config";

const DEFAULT_HEADERS: object = {"Content-Type": "application/json"};
const DEFAULT_GRANT_TYPE: string = "client_credentials";

const TEST_AUTH_CREDENTIALS: AuthClientCredentials = {
    apiOAuthUrl: appConfig.MEDCASE_OAUTH_URL_STAGING,
    oauthAudience: appConfig.MEDCASE_OAUTH_AUDIENCE_STAGING
};
const PRODUCTION_AUTH_CREDENTIALS: AuthClientCredentials = {
    apiOAuthUrl: appConfig.MEDCASE_OAUTH_URL_PRODUCTION,
    oauthAudience: appConfig.MEDCASE_OAUTH_AUDIENCE_PRODUCTION
};

export class MedcaseAuthClient {
    private authToken: AuthToken;
    private readonly authClientCredentials: AuthClientCredentials;
    private readonly clientCredentials: ClientCredentials;

    constructor(config: {
        testEnv?: boolean,
        clientCredentials: ClientCredentials
    }) {
        this.clientCredentials = config.clientCredentials;
        this.authClientCredentials = config.testEnv ? TEST_AUTH_CREDENTIALS : PRODUCTION_AUTH_CREDENTIALS;
        this.authToken = {};
    }

    public getAuthHeader = async (): Promise<string> => {
        if (!this.authToken.value || this.isExpired(this.authToken))
            await this.refreshAuthToken();

        return `Bearer ${this.authToken.value}`;
    };

    public refreshAuthToken = async (): Promise<void> => {
        const authRequestBody: AuthRequestBody = this.provideAuthRequestBody();

        this.authToken = await axios.post(this.authClientCredentials.apiOAuthUrl, authRequestBody, DEFAULT_HEADERS)
            .then((authTokenResponse: AxiosResponse): AuthToken => this.generateAuthToken(authTokenResponse.data.access_token, authTokenResponse.data.expires_in));
    };

    private isExpired = ({expirationDate, ttl}: AuthToken): boolean => {
        if (!ttl || !expirationDate) return true;

        const DELTA: number = ttl * 0.1;
        return expirationDate - DELTA <= Date.now();
    };

    private generateAuthToken = (accessToken: string, expiresIn: number): AuthToken => ({
        value: accessToken,
        expirationDate: Date.now() + expiresIn,
        ttl: expiresIn
    });

    private provideAuthRequestBody = (): AuthRequestBody => ({
        client_id: this.clientCredentials.clientId,
        client_secret: this.clientCredentials.clientSecret,
        audience: this.authClientCredentials.oauthAudience,
        grant_type: DEFAULT_GRANT_TYPE
    });
}
