import ExpressError from "../errors/ExpressError.js";

export function validateSchema(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    }
}

export function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        throw new ExpressError("You need to be logged in!", 401);
    } else {
        next();
    }
}