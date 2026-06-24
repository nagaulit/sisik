import { defineConfig } from "prisma/config";

import { env } from "#env";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: env.POSTGRES_URL,
    },
});
