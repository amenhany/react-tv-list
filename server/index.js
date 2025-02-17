const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"]
}

app.use(cors(corsOptions));


app.get('/search', async (req, res) => {
    const searchTerm = "breaking+bad";
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
    const data = await response.json();

    // const { q } = req.query;
    // const config = { params: { q } };
    // const showResults = await axios.get('https://api.tvmaze.com/search/shows', config);

    res.json(data);
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})