import createApp from "#core/app/create-app.js";
import { auth } from "#core/auth/auth.js";
import tasksRouter from "#modules/tasks/tasks.routes.js";

const app = createApp();

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

app.get("/", (c) => {
    c.var.logger.info("Hello from route!");
    return c.json({
        user: c.var.user,
        session: c.var.session,
    });
});

const routes = [tasksRouter] as const;

routes.forEach((r) => app.route("/", r));

export type AppType = (typeof routes)[number];

export default app;
