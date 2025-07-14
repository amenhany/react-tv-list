import express from 'express';
import session from 'express-session';
import cors from 'cors';
import tvmazeRoutes from './routes/tvmaze.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './errors/errorHandler.js';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true
}

const sessionConfig = {
    secret: 'testing',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', tvmazeRoutes);
app.use('/user', userRoutes);

app.use(errorHandler);


export default app;