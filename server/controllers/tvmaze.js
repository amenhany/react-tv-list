import pLimit from "p-limit";

const limit = pLimit(5);

export async function getShows(ids) {
    return Promise.all(
        ids.map(async id => {
            const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
            if (!response.ok) {
                throw new ExpressError('There was a problem connecting to the API', response.status || 502);
            }
            const result = await response.json();
            return result;
        })
    );
}

export async function populateList(shows) {
    return Promise.all(
        shows.map(show =>
            limit(async () => {
                const response = await fetch(`https://api.tvmaze.com/shows/${show.tvmazeId}`);
                if (!response.ok) {
                    throw new ExpressError('There was a problem connecting to the API', response.status || 502);
                }
                const result = await response.json();
                return { show: result, ...show.toObject() };
            })
        )
    );
}