import type { Prisma } from "generated/prisma/client";

export interface CreateAuditLogInput {
    action: AuditAction;

    resource: string;
    resourceId?: string;

    userId?: string;
    organizationId?: string;

    ip?: string;
    userAgent?: string;

    oldValue?: Prisma.JsonValue;
    newValue?: Prisma.JsonValue;
}

export enum AuditAction {
    Create = "create",
    Update = "update",
    Delete = "delete",
    Login = "login",
    Logout = "logout",
}
