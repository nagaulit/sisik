import z from "zod";

import { createEnv } from "#core/env/env.util";

const envSchema = z
    .object({
        // app
        NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
        LOG_LEVEL: z
            .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
            .default("info"),
        APP_URL: z.url().default("http://localhost:3000"),
        APP_NAME: z.string().default("Sisik"),

        // db
        POSTGRES_URL: z.url().default("postgresql://postgres:password@localhost:5432/sisik"),

        // s3
        S3_ENDPOINT: z.url().default("http://localhost:9000"),
        S3_ACCESS_KEY: z.string().optional(),
        S3_SECRET_KEY: z.string().optional(),
        S3_REGION: z.string().default("us-east-1"),
        S3_BUCKET: z.string().optional(),

        // mail
        SMTP_HOST: z.string().default("localhost"),
        SMTP_PORT: z.coerce.number().default(1025),
        SMTP_USER: z.string().optional(),
        SMTP_PASS: z.string().optional(),
        SMTP_FROM: z.email().optional(),
        SMTP_FROM_NAME: z.string().optional(),
    })
    .transform((env) => ({
        ...env,
        SMTP_FROM_NAME: env.SMTP_FROM_NAME ?? env.APP_NAME,
    }));

export const env = createEnv(envSchema);
