import { createHono } from "#core/app/create-app.js";
import { dbMiddleware } from "#core/context/middleware.js";
import { errorHandler } from "#core/errors/error.handler.js";
import { loggerMiddleware } from "#core/logger/logger.middleware.js";
import tasksRouter from "#modules/tasks";

const app = createHono();

app.use(loggerMiddleware);

app.onError(errorHandler);

app.use(dbMiddleware);

app.get("/", (c) => {
    c.var.logger.info("Hello from route!");
    return c.text("Hello Hono!");
});

app.route("/", tasksRouter);

export default app;
