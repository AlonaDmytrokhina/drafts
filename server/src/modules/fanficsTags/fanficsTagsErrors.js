export class TagFanficCreationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TagFanficCreationError';
        this.status = 409;
    }
}