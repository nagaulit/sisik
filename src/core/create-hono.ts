import { Hono } from "hono";

import type { HonoLogLayerVariables } from "@loglayer/hono";

export const createHono = () => new Hono<{ Variables: HonoLogLayerVariables }>();
