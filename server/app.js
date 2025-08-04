import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import MongoStore from 'connect-mongo';

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
    origin: ["http://localhost:5173"],
    credentials: true
}

const MONGO_URI = process.env.MONGO_URI;
const store = MongoStore.create({
    mongoUrl: MONGO_URI,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'testing'
    }
});

store.on('error', e => console.error("Session Store Error: ", e));


const sessionConfig = {
    store,
    name: 'session',
    secret: 'testing',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 1000 * 60 * 60 * 24
    }
}

app.set('query parser', 'extended');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(sanitizeV5({ replaceWith: '_' }));
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', tvmazeRoutes);
app.use('/user/shows', showRoutes);
app.use('/user', userRoutes);

app.use(errorHandler);


export default app;