import { createHono } from "#core/create-hono.js";
import { errorHandler } from "#core/errors/error.handler.js";
import { loggerMiddleware } from "#core/logger/logger.middleware.js";
import tasksRouter from "#modules/tasks";

const app = createHono();

app.use(loggerMiddleware);

app.onError(errorHandler);

app.get("/", (c) => {
    c.var.logger.info("Hello from route!");
    return c.text("Hello Hono!");
});

app.route("/", tasksRouter);

export default app;
