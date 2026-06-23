import z, { type ZodType } from "zod";

export function createEnv<T>(schema: ZodType<T>, runtime = process.env): T {
    const normalized = Object.fromEntries(
        Object.entries(runtime).map(([k, v]) => [k, v === "" ? undefined : v]),
    );

    const result = schema.safeParse(normalized);

    if (!result.success) {
        console.error("❌ Invalid environment variables\n");
        console.error(z.prettifyError(result.error));

        process.exit(1);
    }

    return result.data;
}
