import ExpressError from "../errors/ExpressError.js";
import { populateList } from "./tvmaze.js";

export async function getList(req, res) {
    const shows = req.user.showsList;
    const list = await populateList(shows);

    res.json({ list });
}

export async function addToList(req, res) {
    const show = req.body
    const user = req.user;
    if (user.showsList.includes(show)) {
        throw new ExpressError('This show is already in your list', 400);
    }
    user.showsList.push(show);
    await user.save();
    res.json({ shows: user.showsList });
}

export async function updateList(req, res) {
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
}

export function getShow(req, res) {
    const id = Number(req.params.id);
    const user = req.user;
    const foundShow = user.showsList.find(el => el.tvmazeId === id);
    if (foundShow) {
        res.json({ rating: foundShow.rating });
    } else {
        res.json({});
    }
}

export async function updateShow(req, res) {
    const id = Number(req.params.id);
    const user = req.user;
    const { rating } = req.body;
    const index = user.showsList.findIndex(el => el.tvmazeId === id);
    if (index === -1) {
        throw new ExpressError("Show not found in your list", 404);
    }
    user.showsList[index].rating = rating || null;
    await user.save();
    res.json({ message: "Rating changed" });
}

export async function deleteShow(req, res) {
    const id = Number(req.params.id);
    const user = req.user;
    user.showsList = user.showsList.filter(show => show.tvmazeId !== id);
    await user.save();
    res.json({ message: "Delete successful" });
}