import express from 'express'
import { catchAsync } from '../errors/errorHandler.js';
import ExpressError from '../errors/ExpressError.js';
import { getShows } from '../controllers/tvmaze.js';
import CachedList from '../models/cache.js';

const router = express.Router();

router.get('/', catchAsync(async (req, res) => {
    const cached = await CachedList.findOne({ key: 'homepage' });
    if (cached) {
        return res.json(cached.data);
    }

    const animeList = await getShows([919, 1536, 2071, 48450, 5276]);
    const egyptianList = await getShows([75074, 62750, 50854, 52686, 57731]);

    await CachedList.findOneAndUpdate(
        { key: 'homepage' },
        { data: { animeList, egyptianList }, expiry: new Date(Date.now() + 1000 * 60 * 60)},
        { upsert: true }
    );

    res.json({ animeList, egyptianList });
}))

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