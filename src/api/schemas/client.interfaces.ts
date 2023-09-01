export interface ClientCredentials {
    clientSecret: string,
    clientId: string,
    projectId: string,
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