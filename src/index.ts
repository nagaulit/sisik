import { serve } from "@hono/node-server";

import { logger } from "#core/logger/logger.js";

import app from "./app";

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        logger.info(`Server is running on http://localhost:${info.port}`);
    },
);
