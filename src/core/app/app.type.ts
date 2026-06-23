import type { prisma } from "#core/db/prisma.js";
import type { HonoLogLayerVariables } from "@loglayer/hono";
import type { Hono } from "hono";

export interface AppBindings {
    Variables: {
        db: typeof prisma;
        logger: HonoLogLayerVariables["logger"];
    };
}

export type AppType = Hono<AppBindings>;
