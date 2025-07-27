import express from 'express'
import { catchAsync } from '../errors/errorHandler.js';
import { isLoggedIn, validateSchema } from '../validations/validate.js'
import { showJoiSchema, listJoiSchema } from '../validations/schemas.js';
import * as shows from '../controllers/shows.js';

const router = express.Router();


router.route('/')
    .get(isLoggedIn, catchAsync(shows.getList))
    .post(isLoggedIn, validateSchema(showJoiSchema), catchAsync(shows.addToList))
    .patch(isLoggedIn, validateSchema(listJoiSchema), catchAsync(shows.updateList))


router.route('/:id')
    .get(isLoggedIn, shows.getShow)
    .patch(isLoggedIn, validateSchema(showJoiSchema), catchAsync(shows.updateShow))
    .delete(isLoggedIn, catchAsync(shows.deleteShow))

export default router;