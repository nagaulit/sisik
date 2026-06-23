import { Hono } from "hono";

import { env } from "#env";

const app = new Hono();

app.get("/", (c) => {
    console.log(env.APP_URL);
    return c.text("Hello Hono!");
});

export default app;
