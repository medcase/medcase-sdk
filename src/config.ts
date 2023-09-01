import {config} from "dotenv-flow";
import * as process from "process";

config();
export const required = (key: string, variable?: string) => {
    if (!variable)
        throw new Error(`Required property is missing: ${key} on level ${process.env.NODE_ENV}`);
    return variable;
};

export const appConfig = {
    MEDCASE_API_URL_SUFFIX: required("MEDCASE_API_URL_SUFFIX", process.env.MEDCASE_API_URL_SUFFIX),
    MEDCASE_API_URL_PREFIX: required("MEDCASE_API_URL_PREFIX", process.env.MEDCASE_API_URL_PREFIX),
};