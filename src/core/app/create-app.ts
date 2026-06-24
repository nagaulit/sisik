import { Hono } from "hono";

import { authMiddleware } from "#core/auth/auth.middleware.js";
import { dbMiddleware } from "#core/db/db.middleware.js";
import { errorHandler } from "#core/errors/error.handler.js";
import { loggerMiddleware } from "#core/logger/logger.middleware.js";

import type { AppBindings } from "./app.type";

export function createRouter() {
    return new Hono<AppBindings>({
        strict: false,
    });
}

export default function createApp() {
    const app = createRouter();
    app.use(loggerMiddleware);
    app.use(dbMiddleware);
    app.use(authMiddleware);

    // app.notFound(notFoundHandler);
    app.onError(errorHandler);

    return app;
}
