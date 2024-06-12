import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Button,
  Text,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface Movie {
  _id: string;
  title: string;
  director: string;
  year: number;
  ratings: number;
  genre: string;
}

const TabTwoScreen: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie>({
    _id: "",
    title: "",
    director: "",
    year: 0,
    ratings: 0,
    genre: "",
  });
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [ratingError, setRatingError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchMovies();
    console.log("test");
  }, []);

  const fetchMovies = async () => {
    try {
      let url = "http://192.168.100.5:3000/api/movies";
      if (searchQuery.trim() !== "") {
        url += `?search=${searchQuery}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSearch = () => {
    fetchMovies();
  };

  const addMovie = () => {
    if (!isValidMovie(newMovie)) {
      return;
    }
    if (editingMovie) {
      const { title, director, year, ratings, genre } = newMovie;
      const updatedMovie = {
        title,
        director,
        year,
        ratings,
        genre,
        _id: newMovie._id,
      }; // Include _id for consistency
      fetch(`http://192.168.100.5:3000/api/movies/edit/${newMovie._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMovie),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save changes: " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Changes saved successfully:", data);
          const updatedMovies = movies.map((movie) =>
            movie._id === newMovie._id ? { ...newMovie } : movie
          );
          setMovies(updatedMovies);
          setEditingMovie(null);
          setNewMovie({
            _id: "",
            title: "",
            director: "",
            year: 0,
            ratings: 0,
            genre: "",
          });
          setRatingError("");
        })
        .catch((error) => {
          console.error("Error saving changes:", error);
        });
    } else {
      const { title, director, year, ratings, genre } = newMovie;
      const movieToAdd = { title, director, year, ratings, genre };
      // Adding new movie
      fetch("http://192.168.100.5:3000/api/movies/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieToAdd),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add movie");
          }
          return response.json();
        })
        .then((data) => {
          const addedMovie = { ...movieToAdd, _id: data.movie._id }; // Include _id for consistency
          const updatedMovies = [...movies, addedMovie];
          setMovies(updatedMovies);
          setNewMovie({
            _id: "",
            title: "",
            director: "",
            year: 0,
            ratings: 0,
            genre: "",
          });
          setRatingError("");
        })
        .catch((error) => {
          console.error("Error adding movie:", error);
        });
    }
  };

  const deleteMovie = (id: string) => {
    const stringId = id.toString();
    fetch(`http://192.168.100.5:3000/api/movies/delete/${stringId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete movie");
        }

        setMovies(movies.filter((movie) => movie._id !== stringId));
      })
      .catch((error) => {
        console.error("Error deleting movie:", error);
      });
  };

  const editMovie = (movie: Movie) => {
    setEditingMovie(movie);

    setNewMovie({ ...movie, _id: movie._id.toString() });
  };

  const saveChanges = () => {
    if (!isValidMovie(newMovie)) {
      return;
    }
    fetch(`http://192.168.100.5:3000/api/movies/edit/${newMovie._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMovie),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save changes: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Changes saved successfully:", data);
        const updatedMovies = movies.map((movie) =>
          movie._id === newMovie._id ? { ...newMovie } : movie
        );
        setMovies(updatedMovies);
        setEditingMovie(null);
        setNewMovie({
          _id: "",
          title: "",
          director: "",
          year: 0,
          ratings: 0,
          genre: "",
        });
        setRatingError("");
      })
      .catch((error) => {
        console.error("Error saving changes:", error);
      });
  };

  const cancelEdit = () => {
    setEditingMovie(null);
    setNewMovie({
      _id: "",
      title: "",
      director: "",
      year: 0,
      ratings: 0,
      genre: "",
    });
    setRatingError("");
  };

  const handleRatingChange = (text: string) => {
    if (/^\d+$/.test(text)) {
      const rating = parseInt(text);
      if (rating >= 1 && rating <= 5) {
        setNewMovie({ ...newMovie, ratings: rating });
        setRatingError("");
      } else {
        setRatingError("Rating must be between 1 and 5.");
      }
    } else if (text === "") {
      setNewMovie({ ...newMovie, ratings: 0 });
      setRatingError("");
    } else {
      setRatingError("Rating must be a number.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.addMovieText}>
          {editingMovie ? "Edit Movie" : "Add a Movie"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={newMovie.title}
          onChangeText={(text) => setNewMovie({ ...newMovie, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Director"
          value={newMovie.director}
          onChangeText={(text) => setNewMovie({ ...newMovie, director: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Genre"
          value={newMovie.genre}
          onChangeText={(text) => setNewMovie({ ...newMovie, genre: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Year"
          value={newMovie.year.toString()}
          onChangeText={(text) =>
            setNewMovie({ ...newMovie, year: parseInt(text) || 0 })
          }
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Ratings"
          value={newMovie.ratings === 0 ? "" : newMovie.ratings.toString()}
          onChangeText={handleRatingChange}
          keyboardType="numeric"
        />
        {ratingError ? (
          <Text style={styles.errorText}>{ratingError}</Text>
        ) : null}
        <View style={styles.buttonContainer}>
          <Button
            title={editingMovie ? "Save Changes" : "Add Movie"}
            onPress={editingMovie ? saveChanges : addMovie}
            disabled={!isValidMovie(newMovie) || !!ratingError}
          />
          {editingMovie && <Button title="Cancel" onPress={cancelEdit} />}
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for movies..."
          onSubmitEditing={handleSearch}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {movies.length === 0 ? (
        <Text>No movies found</Text>
      ) : (
        movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onDelete={deleteMovie}
            onEdit={editMovie}
          />
        ))
      )}
    </ScrollView>
  );
};

const isValidMovie = (movie: Movie) => {
  return (
    movie.title.trim() !== "" &&
    movie.director.trim() !== "" &&
    movie.year !== 0 &&
    movie.ratings >= 1 &&
    movie.ratings <= 5
  );
};

interface MovieCardProps {
  movie: Movie;
  onDelete: (id: string) => void;
  onEdit: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onDelete, onEdit }) => {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.movieText}>Title: {movie.title}</ThemedText>
      <ThemedText style={styles.movieText}>
        Director: {movie.director}
      </ThemedText>
      <ThemedText style={styles.movieText}>Genre: {movie.genre}</ThemedText>
      <ThemedText style={styles.movieText}>Year: {movie.year}</ThemedText>
      <ThemedText style={styles.movieText}>Ratings: {movie.ratings}</ThemedText>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => onEdit(movie)} />
        <Button title="Delete" onPress={() => onDelete(movie._id)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  addMovieText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  movieText: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default TabTwoScreen;
