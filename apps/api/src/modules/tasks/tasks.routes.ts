import { getConnInfo } from "hono/cloudflare-workers";

import { searchSchema } from "#common/schema/search.schema.js";
import { createRouter } from "#core/app/create-app.js";
import { AuditAction, log as audit } from "#core/audit";
import { createListResult } from "#core/db/list.js";
import { paginate } from "#core/db/pagination.js";
import { validator } from "#core/validation/validator.js";

import { create, getByIdOrThrow, list, remove, update } from "./tasks.action";
import { createTaskSchema, updateTaskSchema } from "./tasks.schema";

const tasksRouter = createRouter()
    .basePath("/tasks")
    .post("/", validator("json", createTaskSchema), async (c) => {
        const data = c.req.valid("json");
        const { remote } = getConnInfo(c);
        const userAgent = c.req.header("User-Agent");

        const task = await create(data);

        await audit({
            action: AuditAction.Create,
            resource: "task",
            resourceId: task.id,
            newValue: task,
            userId: c.var.user?.id,
            ip: remote.address,
            userAgent,
        });

        return c.json(task, 201);
    })
    .get("/", validator("query", searchSchema), async (c) => {
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
    })
    .get("/:id", async (c) => {
        const task = await getByIdOrThrow(c.req.param("id"));

        return c.json(task);
    })
    .patch("/:id", validator("json", updateTaskSchema), async (c) => {
        const id = c.req.param("id");
        const data = c.req.valid("json");

        const { remote } = getConnInfo(c);
        const userAgent = c.req.header("User-Agent");

        const before = await getByIdOrThrow(id);
        const after = await update(id, data);

        await audit({
            action: AuditAction.Update,
            resource: "task",
            resourceId: id,
            oldValue: before,
            newValue: after,
            userId: c.var.user?.id,
            ip: remote.address,
            userAgent,
        });

        return c.json(after);
    })
    .delete("/:id", async (c) => {
        const id = c.req.param("id");

        const { remote } = getConnInfo(c);
        const userAgent = c.req.header("User-Agent");

        const task = await getByIdOrThrow(id);

        await remove(id);

        await audit({
            action: AuditAction.Delete,
            resource: "task",
            resourceId: id,
            oldValue: task,
            userId: c.var.user?.id,
            ip: remote.address,
            userAgent,
        });

        return c.body(null, 204);
    });

export default tasksRouter;
