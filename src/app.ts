import { type HonoLogLayerVariables } from "@loglayer/hono";
import { Hono } from "hono";

import { loggerMiddleware } from "#core/logger/logger.middleware.js";
import { env } from "#env";
import tasksRouter from "#modules/tasks";

const app = new Hono<{ Variables: HonoLogLayerVariables }>();

app.use(loggerMiddleware);

app.get("/", (c) => {
    console.log(env.APP_URL);
    c.var.logger.info("Hello from route!");
    return c.text("Hello Hono!");
});

app.route("/", tasksRouter);

export default app;
