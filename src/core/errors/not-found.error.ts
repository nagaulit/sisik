import { AppError } from "./app.error";

export class NotFoundError extends AppError {
    constructor(resource: string, cause?: unknown) {
        super(404, `${resource} not found`, "NOT_FOUND", cause);
    }
}
