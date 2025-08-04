import User from '../models/user.js'
import passport from 'passport';

import { validateUser } from '../validations/validate.js';
import ValidationError from '../errors/ValidationError.js';
import ExpressError from '../errors/ExpressError.js';
import cloudinary from '../middleware/uploads.js';
import { populateList } from './tvmaze.js';


export async function register(req, res, next) {
    const { email, username, password } = req.body;
    const errors = await validateUser(req.body);

    if (Object.keys(errors).length) throw new ValidationError(errors);
    const user = await User.register(new User({ email, username }), password);
    req.login(user, err => {
        if (err) return next(err);
        res.json({ user });
    });
}

export function login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) throw new ExpressError(info?.message || "Invalid credentials", 400);

        req.login(user, err => {
            if (err) return next(err);
            res.json({ user });
        });
    })(req, res, next);
}

export function checkSession(req, res) {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    }
    else {
        res.status(401).json({ user: null });
    }
}

export function logout(req, res, next) {
    req.logout(err => {
        if (err) return next(err);
        res.json({ message: "Logged out" });
    });
}

export async function validateRegistration(req, res) {
    await validateUser(req.body, req.user, true);
    res.json({ success: true });
}

export async function validateUpdate(req, res) {
    await validateUser(req.body, req.user, true, ['password', 'confirmPassword']);
    res.json({ success: true });
}

export async function update(req, res) {
    const user = req.user;
    const data = req.body
    const errors = await validateUser(data, user, false, ['confirmPassword']);
    if (Object.keys(errors).length) throw new ValidationError(errors);

    await new Promise((resolve, reject) => {
        user.authenticate(data.password, (err, userObj, passwordError) => {
            if (err) return reject(new ExpressError(err.message, err.status));
            if (passwordError) return reject(new ValidationError({ ...errors, password: "Incorrect Password" }))
            resolve();
        });
    });

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'tvlist',
            allowed_formats: ['jpg', 'png', 'webp']
        });

        if (user.avatar?.name) {
            await cloudinary.uploader.destroy(user.avatar.name);
        }

        user.avatar = { url: result.secure_url, name: result.public_id };
    }

    user.username = data.username;
    user.email = data.email;
    user.bio = data.bio;
    await user.save();
    req.login(user, (err) => {
        if (err) return next(err);
        res.json({ message: "Username updated and session refreshed" });
    });
}

export async function deleteUser(req, res) {
    const user = await User.findByIdAndDelete(req.user._id);
    req.logout(() => res.json({ message: "Account deleted" }));
}

export async function changePassword(req, res) {
    const user = req.user;
    const data = req.body;
    const { password, confirmPassword } = await validateUser(data, user);
    const errors = {
        ...(password !== undefined && { password }),
        ...(confirmPassword !== undefined && { confirmPassword })
    };

    if (Object.keys(errors).length) throw new ValidationError(errors);

    await new Promise((resolve, reject) => {
        user.changePassword(data.currentPassword, data.password, function(err, user) {
            if (err) reject(new ValidationError({ ...errors, currentPassword: "Incorrect Password" }));
            else resolve();
        });
    });

    res.json({ success: true });
}


const publicUser = user => ({
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
    listTitle: user.listTitle,
    sorting: user.sorting,
    createdAt: user.createdAt
})

export async function getUser(req, res) {
    const { username } = req.params;
    const user = await User.findByUsername(username);
    if (!user) throw new ExpressError(`User "${username}" not found`, 404);
    else res.json({ user: publicUser(user) });
}

export async function getUserShows(req, res) {
    const { username } = req.params;

    // const cached = await CachedList.findOne({ key: `${username}List` });
    // if (cached) {
    //     return res.json(cached.data);
    // }

    const user = await User.findByUsername(username);
    if (!user) throw new ExpressError(`User "${username}" not found`, 404);
    const shows = user.showsList;
    const list = await populateList(shows);

    // await CachedList.findOneAndUpdate(
    //     { key: `${username}List` },
    //     { data: { list }, expiry: new Date(Date.now() + 1000 * 60 * 60)},
    //     { upsert: true }
    // );

    res.json({ list });
}