import { AppError } from "./app.error";

import type { AppBindings } from "#core/app/app.type.js";
import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errorHandler: ErrorHandler<AppBindings> = (err, c) => {
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

    console.error(err);
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
