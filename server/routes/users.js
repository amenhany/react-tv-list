import express from 'express'
import { catchAsync } from '../errors/errorHandler.js';
import { isLoggedIn, validateSchema, validateUserUpdate } from '../validations/validate.js'
import { userJoiSchema } from '../validations/schemas.js';
import User from '../models/user.js'
import ExpressError from '../errors/ExpressError.js';
import passport from 'passport';
import cloudinary, { upload } from '../middleware/uploads.js';

const router = express.Router();

const publicUser = user => ({
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
    listTitle: user.listTitle,
    sorting: user.sorting,
    createdAt: user.createdAt
})


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
    req.logout(err => {
        if (err) return next(err);
        res.json({ message: "Logged out" });
    });
})

router.put('/check-data', catchAsync(async (req, res) => {
    const { username } = req.query;
    const duplicateUser = await User.findOne({ username });
    if (duplicateUser) {
        throw new ExpressError("A user with the given username is already registered", 400)
    }
    else {
        res.json({ message: "Username available" })
    }
}))

router.patch('/check-data', isLoggedIn, catchAsync(async (req, res) => {
    const errors = await validateUserUpdate(req.user, req.body);
    delete errors?.password;
    delete errors?.confirmPassword;

    if (Object.keys(errors).length) return res.status(400).json({ errors });
    else res.json({ success: true });
}))

router.patch('/', isLoggedIn, upload.single('avatar'), catchAsync(async (req, res) => {
    const user = req.user;
    const data = req.body
    const errors = await validateUserUpdate(user, data);
    delete errors?.confirmPassword;

    if (Object.keys(errors).length) return res.status(400).json({ errors });

    await new Promise((resolve, reject) => {
        user.authenticate(data.password, (err, userObj, passwordError) => {
            if (err) return reject(new ExpressError(err.message, err.status));
            if (passwordError) {
                const authError = new ExpressError("Incorrect password", 400);
                authError.errors = { ...errors, password: "Incorrect Password" };
                return reject(authError);
            }
            resolve();
        });
    });


    if (Object.keys(errors).length) return res.status(400).json({ errors: { ...errors, password: "Incorrect Password" }});

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'tvlist',
            allowed_formats: ['jpg', 'png', 'webp']
        });

        if (user.avatar) {
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
}));

router.delete('/', isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);
    console.log(user);
    req.logout(() => res.json({ message: "Account deleted" }));
}));

router.get('/:username', catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findByUsername(username);
    if (!user) throw new ExpressError(`User "${username}" not found`, 404);
    else res.json({ user: publicUser(user) });
}))

router.get('/:username/shows', catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findByUsername(username);
    if (!user) throw new ExpressError(`User "${username}" not found`, 404);
    const shows = user.showsList;
    const list = await Promise.all(
        shows.map(async show => {
            const response = await fetch(`https://api.tvmaze.com/shows/${show.tvmazeId}`);
            if (!response.ok) {
                throw new ExpressError('There was a problem connecting to the API', response.status || 502);
            }
            const result = await response.json();
            return { show: result, ...show.toObject() };
        })
    );

    res.json({ list });
}))

export default router;