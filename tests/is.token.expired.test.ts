import {AuthToken} from "../src";
import {isExpired} from "../src/api/utils/is.expired";

describe('isExpired', () => {
  test('returns true if ttl or expirationDate is missing', () => {
    const token: AuthToken = {};
    expect(isExpired(token)).toBe(true);

    token.ttl = 3600;
    expect(isExpired(token)).toBe(true);

    token.ttl = undefined;
    token.expirationDate = Date.now() + 3600000;
    expect(isExpired(token)).toBe(true);
  });

  test('returns true if the token is expired', () => {
    const token: AuthToken = {
      expirationDate: Date.now() - 3600000,
      ttl: 3600,
    };
    expect(isExpired(token)).toBe(true);
  });

  test('returns false if the token is not expired', () => {
    const token: AuthToken = {
      expirationDate: Date.now() + 3600000,
      ttl: 3600,
    };
    expect(isExpired(token)).toBe(false);
  });
});
