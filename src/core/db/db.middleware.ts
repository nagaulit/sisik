import { prisma } from "#core/db/prisma.js";

import type { MiddlewareHandler } from "hono/types";

export const dbMiddleware: MiddlewareHandler = async (c, next) => {
    c.set("db", prisma);
    await next();
};
