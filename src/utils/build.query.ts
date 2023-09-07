export const buildQuery = (queryParameters: { [key: string]: string }): string =>
    `?${Object.keys(queryParameters).map(key => `${key}=${queryParameters[key]}`).join('&')} `;

export const buildPath = (pathParameters: string[], queryParameters?: { [key: string]: string }) =>
    `${pathParameters.join('/')}${queryParameters ? buildQuery(queryParameters) : ""}`;
