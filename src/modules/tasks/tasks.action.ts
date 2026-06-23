import { type TaskWhereInput } from "generated/prisma/models";
import { HTTPException } from "hono/http-exception";

import { prisma } from "#core/database/prisma";

import { type CreateTaskInput, type UpdateTaskInput } from "./tasks.schema";

export async function getById(id: string) {
    return prisma.task.findUnique({ where: { id } });
}

export async function getByIdOrThrow(id: string) {
    const task = await getById(id);

    if (!task) throw new HTTPException(404);

    return task;
}

export async function list(options?: { where?: TaskWhereInput; take?: number; skip?: number }) {
    return prisma.$transaction([
        prisma.task.findMany({ ...options }),
        prisma.task.count({ ...options }),
    ]);
}

export async function create(data: CreateTaskInput) {
    return prisma.task.create({ data });
}

export async function update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({ where: { id }, data });
}

export async function remove(id: string) {
    return prisma.task.delete({ where: { id } });
}

export async function removeMany(ids: string[]) {
    return prisma.task.deleteMany({ where: { id: { in: ids } } });
}
