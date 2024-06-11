import React, { useState } from "react";
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
  id: number;
  title: string;
  director: string;
  year: number;
  ratings: number;
}

const TabTwoScreen: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie>({
    id: 0,
    title: "",
    director: "",
    year: 0,
    ratings: 0,
  });
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [ratingError, setRatingError] = useState<string>("");

  const addMovie = () => {
    if (!isValidMovie(newMovie)) {
      return; // Don't add movie if it's not valid
    }
    if (editingMovie) {
      // Editing existing movie
      const updatedMovies = movies.map((movie) =>
        movie.id === editingMovie.id ? { ...newMovie } : movie
      );
      setMovies(updatedMovies);
      setEditingMovie(null);
    } else {
      // Adding new movie
      const updatedMovies = [...movies, { ...newMovie, id: movies.length + 1 }];
      setMovies(updatedMovies);
    }
    setNewMovie({ id: 0, title: "", director: "", year: 0, ratings: 0 });
    setRatingError("");
  };

  const deleteMovie = (id: number) => {
    const updatedMovies = movies.filter((movie) => movie.id !== id);
    setMovies(updatedMovies);
  };

  const editMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setNewMovie(movie);
  };

  const cancelEdit = () => {
    setEditingMovie(null);
    setNewMovie({ id: 0, title: "", director: "", year: 0, ratings: 0 });
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
            onPress={addMovie}
            disabled={!isValidMovie(newMovie) || !!ratingError}
          />
          {editingMovie && <Button title="Cancel" onPress={cancelEdit} />}
        </View>
      </View>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onDelete={deleteMovie}
          onEdit={editMovie}
        />
      ))}
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
  onDelete: (id: number) => void;
  onEdit: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onDelete, onEdit }) => {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.movieText}>Title: {movie.title}</ThemedText>
      <ThemedText style={styles.movieText}>
        Director: {movie.director}
      </ThemedText>
      <ThemedText style={styles.movieText}>Year: {movie.year}</ThemedText>
      <ThemedText style={styles.movieText}>Ratings: {movie.ratings}</ThemedText>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => onEdit(movie)} />
        <Button title="Delete" onPress={() => onDelete(movie.id)} />
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
});

export default TabTwoScreen;
