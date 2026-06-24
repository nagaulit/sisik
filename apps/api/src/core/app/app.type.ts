import type { auth } from "#core/auth/auth.js";
import type { prisma } from "#core/db/prisma.js";
import type { HonoLogLayerVariables } from "@loglayer/hono";
import type { Hono } from "hono";

export interface AppBindings {
    Variables: {
        db: typeof prisma;
        logger: HonoLogLayerVariables["logger"];
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
    };
}

export type AppType = Hono<AppBindings>;
