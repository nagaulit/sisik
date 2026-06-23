import { Hono } from "hono";

import { env } from "#env";
import tasksRouter from "#modules/tasks";

const app = new Hono();

app.get("/", (c) => {
    console.log(env.APP_URL);
    return c.text("Hello Hono!");
});

app.route("/", tasksRouter);

export default app;
