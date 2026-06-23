import { AppError } from "./app.error";

import type { AppType } from "#core/create-hono.js";
import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errorHandler: ErrorHandler<AppType> = (err, c) => {
    if (err instanceof AppError) {
        c.var.logger.withMetadata(err).error(err.message);

        return c.json(
            {
                success: false,
                code: err.code,
                message: err.message,
            },
            err.status as ContentfulStatusCode,
        );
    }

    c.var.logger.withMetadata(err).error("Unhandled exception");

    return c.json(
        {
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
        },
        500,
    );
};
