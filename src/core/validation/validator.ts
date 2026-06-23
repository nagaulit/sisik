import { zValidator } from "@hono/zod-validator";

import { BadRequestError } from "../errors";

export function validator(...args: Parameters<typeof zValidator>) {
    return zValidator(args[0], args[1], (result) => {
        if (!result.success) {
            throw new BadRequestError("Validation failed", result.error);
        }
    });
}
