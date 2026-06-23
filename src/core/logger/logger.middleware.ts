import { honoLogLayer } from "@loglayer/hono";

import { logger } from "./logger";

export const loggerMiddleware = honoLogLayer({ instance: logger });
