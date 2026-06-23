import { zValidator } from "@hono/zod-validator";

import { createHono } from "#core/create-hono.js";
import { searchSchema } from "#modules/common/schema/search.schema.js";

import { create, getByIdOrThrow, list, remove, update } from "./tasks.action";
import { createTaskSchema, updateTaskSchema } from "./tasks.schema";

const tasksRouter = createHono().basePath("/tasks");

tasksRouter.post("/", zValidator("json", createTaskSchema), async (c) => {
    const data = c.req.valid("json");

    const task = await create(data);

    return c.json(task, 201);
});

tasksRouter.get("/", zValidator("query", searchSchema), async (c) => {
    const query = c.req.valid("query");
    const tasks = await list({
        where: query.q
            ? {
                  title: {
                      contains: query.q,
                  },
              }
            : undefined,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
    });

    return c.json(tasks);
});

tasksRouter.get("/:id", async (c) => {
    const id = c.req.param("id");

    const task = await getByIdOrThrow(id);

    return c.json(task);
});

tasksRouter.patch("/:id", zValidator("json", updateTaskSchema), async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    await getByIdOrThrow(id);
    const updatedTask = await update(id, data);

    return c.json(updatedTask);
});

tasksRouter.delete("/:id", async (c) => {
    const id = c.req.param("id");

    await getByIdOrThrow(id);
    await remove(id);

    return c.status(204);
});

export default tasksRouter;
