import {AuthConfig} from "./client.interfaces";

export interface ClientCredentials {
    clientSecret: string,
    clientId: string,
    authConfig: AuthConfig,
    url: string
}