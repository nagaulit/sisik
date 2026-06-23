import { searchSchema } from "#common/schema/search.schema.js";
import { createRouter } from "#core/app/create-app.js";
import { createListResult } from "#core/db/list.js";
import { paginate } from "#core/db/pagination.js";
import { validator } from "#core/validation/validator.js";

import { create, getByIdOrThrow, list, remove, update } from "./tasks.action";
import { createTaskSchema, updateTaskSchema } from "./tasks.schema";

const tasksRouter = createRouter().basePath("/tasks");

tasksRouter.post("/", validator("json", createTaskSchema), async (c) => {
    const data = c.req.valid("json");

    const task = await create(data);

    return c.json(task, 201);
});

tasksRouter.get("/", validator("query", searchSchema), async (c) => {
    const query = c.req.valid("query");
    const pagination = paginate(query);

    const [data, total] = await list({
        where: query.q
            ? {
                  title: {
                      contains: query.q,
                  },
              }
            : undefined,
        ...pagination,
    });

    return c.json(createListResult(data, total, query.page, query.limit));
});

tasksRouter.get("/:id", async (c) => {
    const id = c.req.param("id");

    const task = await getByIdOrThrow(id);

    return c.json(task);
});

tasksRouter.patch("/:id", validator("json", updateTaskSchema), async (c) => {
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
