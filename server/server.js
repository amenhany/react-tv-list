import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'development' ? '0.0.0.0' : undefined;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
        app.listen(PORT, HOST, () => {
            console.log("Server running on port " + PORT);
        });
    })
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
    });