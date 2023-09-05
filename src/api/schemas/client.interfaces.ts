export interface ClientCredentials {
    clientSecret: string,
    clientId: string,
}

export interface AuthConfig {
    apiOAuthUrl: string,
    oauthAudience: string
}

export interface AuthToken {
    value?: string,
    expirationDate?: number,
    ttl?: number,
}

export interface AuthRequestBody {
    client_id: string,
    client_secret: string,
    audience: string,
    grant_type: string
}

export type RetryCallError = { response: { status: number } };
