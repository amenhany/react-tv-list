import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export default cloudinary;