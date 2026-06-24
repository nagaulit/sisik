import { AppError } from "./app.error";

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized", cause?: unknown) {
        super(401, message, "UNAUTHORIZED", cause);
    }
}
