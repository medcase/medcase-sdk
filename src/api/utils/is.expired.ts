import {AuthToken} from "../schemas/client.interfaces";

export const isExpired = ({expirationDate, ttl}: AuthToken): boolean => {
    if (!ttl || !expirationDate) return true;

    const DELTA: number = ttl * 0.1;
    return expirationDate - DELTA <= Date.now();
};