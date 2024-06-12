const Movie = require("../models/movie");

// Get All Movies Data
exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ movies: movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add one movie to the list of movies
exports.addMovie = async (req, res, next) => {
  try {
    const { title, director, year, ratings } = req.body;

    // Create a new movie document
    const newMovie = await Movie.create({
      title: title,
      director: director,
      year: year,
      ratings: ratings,
    });

    res.status(201).json({ movie: newMovie });
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Edit a movie
exports.editMovie = async (req, res, next) => {
  const movieId = req.params.id;
  const { title, director, year, ratings } = req.body;

  try {
    const movie = await Movie.findById(movieId);

    // If movie is not found, return a 404 error
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Update the movie with the new data
    movie.title = title || movie.title;
    movie.director = director || movie.director;
    movie.year = year || movie.year;
    movie.ratings = ratings || movie.ratings;

    const updatedMovie = await movie.save();

    res.status(200).json({ movie: updatedMovie });
  } catch (error) {
    console.error("Error editing movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete one movie
exports.deleteMovie = async (req, res, next) => {
  const movieId = req.params.id;

  try {
    const deletedMovie = await Movie.findOneAndDelete({ _id: movieId });

    // If movie is not found, return a 404 error
    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
