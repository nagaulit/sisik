import { prisma } from "#core/db/prisma.js";
import { logger } from "#core/logger/logger.js";

import type { CreateAuditLogInput } from "./audit.types";

export async function log(data: CreateAuditLogInput) {
    logger
        .withContext({
            module: "audit",
            action: data.action,
            resource: data.resource,
            resourceId: data.resourceId,
            userId: data.userId,
            organizationId: data.organizationId,
        })
        .withMetadata({
            ip: data.ip,
            userAgent: data.userAgent,
        })
        .info("audit log");

    logger.clearContext();

    return prisma.auditLog.create({
        data: {
            ...data,
            oldValue: data.oldValue ?? undefined,
            newValue: data.newValue ?? undefined,
        },
    });
}
