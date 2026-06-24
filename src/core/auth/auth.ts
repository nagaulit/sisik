import { redisStorage } from "@better-auth/redis-storage";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, openAPI } from "better-auth/plugins";

import { infraConfig } from "#config/infra.config.js";
import { prisma } from "#core/db/prisma.js";
import { redis } from "#core/redis/redis.js";
import { env } from "#env";

export const auth = betterAuth({
    appName: env.APP_NAME,
    baseURL: env.APP_URL,
    secret: env.AUTH_SECRET,
    rateLimit: {
        enabled: infraConfig.isProduction,
        storage: "secondary-storage",
    },
    emailAndPassword: {
        enabled: true,
    },
    secondaryStorage: redisStorage({
        client: redis,
        // keyPrefix: "better-auth:", // optional, defaults to "better-auth:"
    }),
    plugins: [
        openAPI({
            theme: "kepler",
        }),
        bearer(),
    ],
    experimental: {
        joins: true,
    },
    logger: {
        level: infraConfig.isDebugEnabled ? "debug" : "info",
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            partitioned: true, // New browser standards will mandate this for foreign cookies
        },
    },
});
