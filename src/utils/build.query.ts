export const buildQuery = (queryParameters: { [key: string]: string }): string =>
    `?${Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&')} `;