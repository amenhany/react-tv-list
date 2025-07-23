import express from 'express'
import { catchAsync } from '../errors/errorHandler.js';
import { isLoggedIn, validateSchema } from '../validations/validate.js'
import { showJoiSchema, listJoiSchema } from '../validations/schemas.js';
import ExpressError from '../errors/ExpressError.js';

const router = express.Router();

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const shows = req.user.showsList;
    const list = await Promise.all(
        shows.map(async show => {
            const response = await fetch(`https://api.tvmaze.com/shows/${show.tvmazeId}`);
            if (!response.ok) {
                throw new ExpressError('There was a problem connecting to the API', response.status || 502);
            }
            const result = await response.json();
            return { show: result, ...show.toObject() };
        })
    );

    res.json({ list });
}))

router.post('/', isLoggedIn, validateSchema(showJoiSchema), catchAsync(async (req, res) => {
    const show = req.body
    const user = req.user;
    if (user.showsList.includes(show)) {
        throw new ExpressError('This show is already in your list', 400);
    }
    user.showsList.push(show);
    await user.save();
    res.json({ shows: user.showsList });
}))

router.patch('/', isLoggedIn, validateSchema(listJoiSchema), catchAsync(async (req, res) => {
    const { title, order, sorting } = req.body;
    const user = req.user;

    if (title) {
        user.listTitle = title;
    }

    if (order) {
        user.showsList.sort((a, b) => {
            return order.indexOf(a.tvmazeId) - order.indexOf(b.tvmazeId);
        });
    }

    if (sorting) {
        user.sorting.key = sorting.key;
        user.sorting.ascending = sorting.ascending;
    }

    await user.save();
    res.json({ success: true });
}))


router.get('/:id', isLoggedIn, (req, res) => {
    const id = Number(req.params.id);
    const user = req.user;
    const foundShow = user.showsList.find(el => el.tvmazeId === id);
    if (foundShow) {
        res.json({ rating: foundShow.rating });
    } else {
        res.json({});
    }
})

router.patch('/:id', isLoggedIn, validateSchema(showJoiSchema), catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    const user = req.user;
    const { rating } = req.body;
    const index = user.showsList.findIndex(el => el.tvmazeId === id);
    user.showsList[index].rating = rating || null;
    await user.save();
    res.json({ message: "Rating changed" });
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    const user = req.user;
    user.showsList = user.showsList.filter(show => show.tvmazeId !== id);
    await user.save();
    res.json({ message: "Delete successful" });
}))

export default router;