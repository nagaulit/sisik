import { zValidator } from "@hono/zod-validator";

import { BadRequestError } from "./errors";

import type { ValidationTargets } from "hono";
import type z from "zod";

export function validator<T extends z.ZodType>(
    validationTarget: keyof ValidationTargets,
    schema: T,
) {
    return zValidator(validationTarget, schema, (result) => {
        if (!result.success) {
            throw new BadRequestError("Validation failed", result.error);
        }
    });
}
