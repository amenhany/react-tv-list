import express from 'express'
import { catchAsync } from '../errors/errorHandler.js';
import { isLoggedIn, validateSchema, validateUser } from '../validations/validate.js'
import { userJoiSchema } from '../validations/schemas.js';
import { upload } from '../middleware/uploads.js';
import * as users from '../controllers/users.js';

const router = express.Router();


router.post('/register', validateSchema(userJoiSchema), catchAsync(users.register))
router.post('/login', users.login);
router.get('/check-session', users.checkSession)
router.get('/logout', users.logout)

router.route('/check-data')
    .post(catchAsync(users.validateRegistration))                              // Check data during registration 
    .patch(isLoggedIn, catchAsync(users.validateUpdate))                       // Check data while typing in update form

router.route('/')
    .patch(isLoggedIn, upload.single('avatar'), catchAsync(users.update))      // Check data submitted from update form
    .delete(isLoggedIn, catchAsync(users.deleteUser));

router.patch('/change-password', isLoggedIn, catchAsync(users.changePassword))

// Public user info
router.get('/:username', catchAsync(users.getUser))
router.get('/:username/shows', catchAsync(users.getUserShows))

export default router;