import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import MongoStore from 'connect-mongo';

// import path from 'path';
// import { fileURLToPath } from 'url';

import passport from 'passport';
import LocalStrategy from 'passport-local';

import tvmazeRoutes from './routes/tvmaze.js';
import userRoutes from './routes/users.js';
import showRoutes from './routes/shows.js';
import { errorHandler } from './errors/errorHandler.js';
import { sanitizeV5 } from './validations/mongoSanitize.js';
import User from './models/user.js';

const app = express();
const corsOptions = {
    origin: process.env.NODE_ENV === 'development' ? ['http://localhost:5173', process.env.FRONTEND_URL] : [process.env.FRONTEND_URL],
    credentials: true
}

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI;
const store = MongoStore.create({
    mongoUrl: MONGO_URI,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});

store.on('error', e => console.error("Session Store Error: ", e));


const sessionConfig = {
    store,
    name: 'session',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
    }
}

app.set('trust proxy', 1);
app.set('query parser', 'extended');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(sanitizeV5({ replaceWith: '_' }));
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api', tvmazeRoutes);
app.use('/api/user/shows', showRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, "../client/dist")));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
//     });
// }

export default app;