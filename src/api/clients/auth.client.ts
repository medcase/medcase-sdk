import {AuthRequestBody, AuthToken, ClientCredentials} from "../schemas/client.interfaces";
import axios, {AxiosResponse} from "axios";

const DEFAULT_HEADERS: object = {"Content-Type": "application/json"};
const DEFAULT_GRANT_TYPE: string = "client_credentials";

export class AuthClient {
    private authToken: AuthToken;
    private readonly clientCredentials: ClientCredentials;

    constructor(
        clientCredentials: ClientCredentials
    ) {
        this.clientCredentials = clientCredentials;
        this.authToken = {};
    }

    public getAuthHeader = async (): Promise<string> => {
        if (!this.authToken.value || this.isExpired(this.authToken))
            await this.refreshAuthToken();

        return `Bearer ${this.authToken.value}`;
    };

    public refreshAuthToken = async (): Promise<void> => {
        const authRequestBody: AuthRequestBody = this.provideAuthRequestBody();

        this.authToken = await axios.post(this.clientCredentials.authConfig.apiOAuthUrl, authRequestBody, DEFAULT_HEADERS)
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
        audience: this.clientCredentials.authConfig.oauthAudience,
        grant_type: DEFAULT_GRANT_TYPE
    });
}
