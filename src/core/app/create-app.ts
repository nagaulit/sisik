import { Hono } from "hono";

import type { AppVariables } from "../context";

export const createHono = () => new Hono<{ Variables: AppVariables }>();
