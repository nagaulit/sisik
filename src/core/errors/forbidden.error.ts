import { AppError } from "./app.error";

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden", cause?: unknown) {
        super(403, message, "FORBIDDEN", cause);
    }
}
