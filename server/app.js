import express from 'express';
import cors from 'cors';
import tvmazeRoutes from './routes/tvmaze.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './errors/errorHandler.js';

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"]
}

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', tvmazeRoutes);
app.use('/user', userRoutes);

app.use(errorHandler);


export default app;