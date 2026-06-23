import createApp from "#core/app/create-app.js";
import tasksRouter from "#modules/tasks/tasks.routes.js";

const app = createApp();

app.get("/", (c) => {
    c.var.logger.info("Hello from route!");
    return c.text("Hello Hono!");
});

const routes = [tasksRouter] as const;

routes.forEach((r) => app.route("/", r));

export type AppType = (typeof routes)[number];

export default app;
