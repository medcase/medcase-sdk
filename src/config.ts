import * as process from "process";

export const required = (key: string, variable?: string) => {
    if (!variable)
        throw new Error(`Required property is missing: ${key} on level ${process.env.NODE_ENV}`);
    return variable;
};

export const appConfig = {
    MEDCASE_STAGING_API_URL: required("MEDCASE_STAGING_API_URL", process.env.MEDCASE_STAGING_API_URL),
    MEDCASE_PRODUCTION_API_URL: required("MEDCASE_PRODUCTION_API_URL", process.env.MEDCASE_PRODUCTION_API_URL),
    MEDCASE_OAUTH_URL_STAGING: required("MEDCASE_OAUTH_URL_STAGING", process.env.MEDCASE_OAUTH_URL_STAGING),
    MEDCASE_OAUTH_AUDIENCE_STAGING: required("MEDCASE_OAUTH_AUDIENCE_STAGING", process.env.MEDCASE_OAUTH_AUDIENCE_STAGING),
    MEDCASE_OAUTH_URL_PRODUCTION: required("MEDCASE_OAUTH_URL_PRODUCTION", process.env.MEDCASE_OAUTH_URL_PRODUCTION),
    MEDCASE_OAUTH_AUDIENCE_PRODUCTION: required("MEDCASE_OAUTH_AUDIENCE_PRODUCTION", process.env.MEDCASE_OAUTH_AUDIENCE_PRODUCTION),
};