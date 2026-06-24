import z from "zod";

export const createTaskSchema = z.object({
    title: z.string().nonempty(),
    done: z.boolean().default(false),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
