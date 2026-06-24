import { AppError } from "./app.error";

export class BadRequestError extends AppError {
    constructor(message = "Bad request", cause?: unknown) {
        super(400, message, "BAD_REQUEST", cause);
    }
}
