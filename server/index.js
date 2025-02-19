const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"]
}

app.use(cors(corsOptions));


app.get('/search', async (req, res) => {
    const { q: searchTerm } = req.query;
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`)
    .catch((e) => console.log(e));
    const data = await response.json();

    res.json(data);
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})