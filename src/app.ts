import createApp from "#core/app/create-app.js";
import tasksRouter from "#modules/tasks/tasks.router.js";

const app = createApp();

app.get("/", (c) => {
    c.var.logger.info("Hello from route!");
    return c.text("Hello Hono!");
});

app.route("/", tasksRouter);

export default app;
