export class TagValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TagValidationError';
        this.status = 400;
    }
}

export class TagConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TagConflictError';
        this.status = 409;
    }
}
