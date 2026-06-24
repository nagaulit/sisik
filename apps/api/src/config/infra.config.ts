import { env } from "#env";

import packageJSON from "../../package.json";

export const infraConfig = {
    isProduction: env.NODE_ENV === "production",
    isDebugEnabled:
        env.LOG_LEVEL === "debug" || env.LOG_LEVEL === "trace" || env.NODE_ENV === "development",
    version: packageJSON.version,
} as const;
