import {defineRetryCondition, RetryCallError} from "../src/api/utils/make.retry.call";

describe('defineRetryCondition', () => {
    it('should return true for error with status 500', () => {
        const error = {
            response: {
                status: 500
            }
        };
        const result = defineRetryCondition(error);
        expect(result).toBe(true);
    });

    it('should return false for error with status 404', () => {
        const error = {
            response: {
                status: 404
            }
        };
        const result = defineRetryCondition(error);
        expect(result).toBe(false);
    });

    it('should return false for error without response', () => {
        const error: RetryCallError = {response: {status: 404}}

        const result: boolean = defineRetryCondition(error);
        expect(result).toBe(false);
    });
});
