import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "#env";

import { PrismaClient } from "../../../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: env.POSTGRES_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };
