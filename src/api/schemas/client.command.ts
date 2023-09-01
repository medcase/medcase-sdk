
export interface MedcaseClientCommand<T> {
    path: string;
    body?: unknown;
    method: HttpMethod;
    resourceMapper: (resource: T) => T;
    env: MedcaseEnvironment;
}

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

export enum MedcaseEnvironment {
    DEV = 'dev',
    PROD = 'prod',
    TEST = 'test',
    STAGING = 'staging'
}