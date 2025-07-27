class ValidationError extends Error {
    constructor(errors, statusCode = 400) {
        super()
        this.errors = errors,
        this.statusCode = statusCode
    }
}
export default ValidationError;