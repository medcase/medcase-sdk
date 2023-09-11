export class ApiCallError extends Error {
    public code: string | undefined;
    public data: string | undefined;

    constructor(code?: string, message?: string, data?: string) {
        super(message);
        this.code = code;
        this.data = data;
    }
}