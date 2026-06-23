import { Hono } from "hono";

import type { HonoLogLayerVariables } from "@loglayer/hono";

export type AppType = { Variables: HonoLogLayerVariables };

export const createHono = () => new Hono<AppType>();
