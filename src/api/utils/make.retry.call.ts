import {AxiosResponse} from "axios";

export const calculateRetryDelay = (retryCount: number, multiplier?: number) =>
    Math.pow(2, retryCount) * (multiplier !== undefined ? multiplier : 1000);

export type RetryCallError = { response: { status: number } };
export const defineRetryCondition = (error: RetryCallError) => {
    const INTERNAL_SERVER_ERROR = 500;

    return !!error.response && error?.response.status >= INTERNAL_SERVER_ERROR;
}

export const makeRetryCall = async (
    requestFunc: () => Promise<AxiosResponse>,
    beforeRetryHook?: () => Promise<void> | void,
    retryCondition: ((error: RetryCallError) => boolean) = defineRetryCondition,
    retries = 3,
    attempt = 0
): Promise<AxiosResponse> => {
    try {
        attempt += 1;
        return requestFunc();
    } catch (error) {
        if (attempt > retries || !retryCondition(error as RetryCallError))
            throw error;

        if (beforeRetryHook)
            await beforeRetryHook();


        await new Promise((resolve) => setTimeout(resolve, calculateRetryDelay(attempt)));

        return makeRetryCall(requestFunc, beforeRetryHook, retryCondition, retries, attempt);
    }
};


