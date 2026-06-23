import type { prisma } from "#core/database/prisma";
import type { HonoLogLayerVariables } from "@loglayer/hono";

export interface AppVariables {
    db: typeof prisma;
    logger: HonoLogLayerVariables["logger"];
}
