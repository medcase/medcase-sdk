import {calculateRetryDelay} from "../src/api/utils/make.retry.call";

describe("calculateRetryDelay", () => {
  it("should return 0 for retryCount of 0", () => {
    expect(calculateRetryDelay(0, 0)).toEqual(0);
  });

  it("should return a positive number for retryCount > 0", () => {
    expect(calculateRetryDelay(1)).toBeGreaterThan(0);
  });

  it("should increase the retry delay as retryCount increases", () => {
    const delay1 = calculateRetryDelay(1);
    const delay2 = calculateRetryDelay(2);
    const delay3 = calculateRetryDelay(3);

    expect(delay1).toBeLessThan(delay2);
    expect(delay2).toBeLessThan(delay3);
  });

  it("should return a floating point number for positive retryCount", () => {
    expect(Number.isFinite(calculateRetryDelay(10))).toBe(true);
  });

  it('should return Infinity for retryCount of Infinity', () => {
    expect(calculateRetryDelay(Infinity)).toBe(Infinity);
  });

  it('should return NaN for retryCount of NaN', () => {
    expect(isNaN(calculateRetryDelay(NaN))).toBe(true);
  });

});
