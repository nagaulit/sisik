import z from "zod";

export const searchSchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
});

export type SearchInput = z.infer<typeof searchSchema>;
