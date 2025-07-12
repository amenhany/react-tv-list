import express from 'express'
import { catchAsync } from '../errors/errorHandler.js';
import { validateSchema } from '../validations/validate.js'
import { userJoiSchema } from '../validations/schemas.js';

const router = express.Router();

router.post('/register', validateSchema(userJoiSchema), (req, res) => {
    const { email, username, password } = req.body;
    console.log(req.body);
})

export default router;