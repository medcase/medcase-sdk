export type Parameters <T> = {
    projectId: string,
    data: T
}

export interface Client<T> {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    retrieve?: (parameters: Parameters<any>) => Promise<T>;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    create?: (parameters: Parameters<any>) => Promise<T>;
}