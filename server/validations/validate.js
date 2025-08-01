import ExpressError from "../errors/ExpressError.js";
import { userJoiSchema } from "./schemas.js";
import User from '../models/user.js'
import ValidationError from "../errors/ValidationError.js";

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

export async function validateUser(data, user = null, validationError = false, remove = []) {
    const { error } = userJoiSchema.validate(data, { abortEarly: false });
    const messages = {};

    if (error) {
        error.details.forEach(detail => {
            const key = detail.path[0];
            messages[key] = detail.message;
        });
    }

    if (data.username !== user?.username) {
        const duplicateUser = await User.findOne({ username: data.username });
        if (duplicateUser) {
            messages.username = "Username Taken"
        }
    }

    if (data.email !== user?.email) {
        const duplicateUser = await User.findOne({ email: data.email });
        if (duplicateUser) {
            messages.email = "Email already registered"
        }
    }

    for (const key of remove) {
        delete messages[key];
    }

    if (validationError && Object.keys(messages).length) {
        throw new ValidationError(messages);
    }

    return messages;
}