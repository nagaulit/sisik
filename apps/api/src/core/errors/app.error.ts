export class AppError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly code: string,
        public readonly cause?: unknown,
    ) {
        super(message);
        this.name = new.target.name;
    }
}
