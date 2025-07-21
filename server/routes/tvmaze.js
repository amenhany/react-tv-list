import express from 'express'
import { catchAsync } from '../errors/errorHandler.js';
import ExpressError from '../errors/ExpressError.js';

const router = express.Router();


router.get('/search', catchAsync(async (req, res) => {
    const searchTerm = encodeURIComponent(req.query.q);
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
    if (!response.ok) {
        throw new ExpressError('There was a problem connecting to the API', response.status || 502);
    }

    const results = await response.json();

    res.json(results);
}))

export default router;