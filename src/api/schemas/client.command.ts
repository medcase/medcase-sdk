
export interface MedcaseClientCommand<T> {
    path: string;
    body?: unknown;
    method: HttpMethod;
    resourceMapper: (resource: T) => T;
}

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}
