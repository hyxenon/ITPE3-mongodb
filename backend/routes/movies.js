const express = require("express");

const movieController = require("../controllers/movie");
const router = express.Router();

// Get all movies
router.get("/movies", movieController.getMovies);

// Add one movie to the list of movies
router.post("/movies/add", movieController.addMovie);

// Edit one movie
router.put("/movies/edit/:id", movieController.editMovie);

// Delete one movie from the list of movies
router.delete("/movies/delete/:id", movieController.deleteMovie);

module.exports = router;
