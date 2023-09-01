import {AuthRequestBody, AuthToken, ClientCredentials} from "./schemas/client.interfaces";
import axios from "axios";
import {isExpired} from "./utils/is.expired";

export class MedcaseAuthClient {
    private authToken: AuthToken;
    private readonly defaultHeaders: object = {"Content-Type": "application/json"};
    private readonly defaultGrantType: string = "client_credentials";

    constructor() {
        this.authToken = {};
    }

    public getAuthHeader = async (medcaseCredentials: ClientCredentials): Promise<string> => {
        if (!this.authToken.value || isExpired(this.authToken))
            await this.refreshAuthToken(medcaseCredentials);

        return `Bearer ${this.authToken.value}`;
    };

    public refreshAuthToken = async (medcaseCredentials: ClientCredentials): Promise<void> => {
        this.authToken = await axios.post(medcaseCredentials.apiOAuthUrl, this.provideAuthRequestBody(medcaseCredentials), this.defaultHeaders)
            .then((authTokenResponse): AuthToken => this.generateAuthToken(authTokenResponse.data.access_token, authTokenResponse.data.expires_in));
    };

    private generateAuthToken = (accessToken: string, expiresIn: number): AuthToken => ({
        value: accessToken,
        expirationDate: Date.now() + expiresIn,
        ttl: expiresIn
    });

    private provideAuthRequestBody = (medcaseCredentials: ClientCredentials): AuthRequestBody => ({
        client_id: medcaseCredentials.clientId,
        client_secret: medcaseCredentials.clientSecret,
        audience: medcaseCredentials.oauthAudience,
        grant_type: this.defaultGrantType
    });
}
