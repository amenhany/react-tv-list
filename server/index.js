const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"]
}

app.use(cors(corsOptions));


app.get('/search', async (req, res) => {
    try {
        const { q: searchTerm } = req.query;
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`)
        const data = await response.json();

        res.json(data);
    } catch (e) {
        console.log(e);
    }
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})