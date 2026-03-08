const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/movieDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// Schemas
const searchSchema = new mongoose.Schema({
    movieName: String,
    searchedAt: { type: Date, default: Date.now }
});

const favoriteSchema = new mongoose.Schema({
    title: String,
    year: String,
    poster: String
});

const Search = mongoose.model("Search", searchSchema);
const Favorite = mongoose.model("Favorite", favoriteSchema);


// Search Movie API
app.get("/movies", async (req, res) => {

    const movieName = req.query.search;

    try {

        await new Search({ movieName }).save();

        const response = await axios.get(
            `https://www.omdbapi.com/?s=${movieName}&apikey=${process.env.API_KEY}`
        );

        res.json(response.data);

    } catch (error) {
        res.status(500).json({ error: "Error fetching movie" });
    }
});


// Movie Details API
app.get("/movie/:id", async (req, res) => {

    const imdbID = req.params.id;

    const response = await axios.get(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.API_KEY}`
    );

    res.json(response.data);
});


// Save Favorite Movie
app.post("/favorite", async (req, res) => {

    const movie = new Favorite(req.body);
    await movie.save();

    res.json({ message: "Movie added to favorites" });
});


// Get Favorites
app.get("/favorites", async (req, res) => {
    const movies = await Favorite.find();
    res.json(movies);
});


// Search History
app.get("/history", async (req, res) => {

    const history = await Search.find()
        .sort({ searchedAt: -1 })
        .limit(5);

    res.json(history);
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});