import express from 'express'
import { catchAsync } from '../errors/errorHandler.js';
import { validateSchema } from '../validations/validate.js'
import { userJoiSchema } from '../validations/schemas.js';
import User from '../models/user.js'
import ExpressError from '../errors/ExpressError.js';
import passport from 'passport';

const router = express.Router();

router.get('/register', catchAsync(async (req, res) => {
    const { username } = req.query;
    const duplicateUser = await User.findOne({ username });
    if (duplicateUser) {
        throw new ExpressError("A user with the given username is already registered", 400)
    }
    else {
        res.json({ message: "Username available" })
    }
}))

router.post('/register', validateSchema(userJoiSchema), catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail) {
        throw new ExpressError("A user with the given email is already registered", 400)
    }
    const user = await User.register(new User({ email, username }), password);
    req.login(user, err => {
        if (err) return next(err);
        res.json({ user });
    });
}))

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) throw new ExpressError(info?.message || "Invalid credentials", 400);

        req.login(user, err => {
            if (err) return next(err);
            res.json({ user });
        });
    })(req, res, next);
})

router.get('/check-session', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    }
    else {
        res.status(401).json({ user: null });
    }
})

router.get('/logout', (req, res, next) => {
    req.logout(next);
    res.json({ message: "Logged out" });
})

export default router;