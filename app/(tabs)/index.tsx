import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useFocusEffect } from "@react-navigation/native";

interface Movie {
  title: string;
  director: string;
  year: number;
  ratings: number;
  genre: string;
}

const HomeScreen: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useFocusEffect(
    React.useCallback(() => {
      fetchMovies();
      console.log("test");
    }, [])
  );

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for movies..."
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.labelMovie}>List of Movies:</Text>
      {movies.length === 0 ? (
        <Text style={styles.labelMovie}>No Movies Found</Text>
      ) : (
        movies.map((movie, index) => <MovieCard key={index} movie={movie} />)
      )}
    </ScrollView>
  );
};

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <View style={styles.card}>
      <ThemedText>Title: {movie.title}</ThemedText>
      <ThemedText>Director: {movie.director}</ThemedText>
      <ThemedText>Genre: {movie.genre}</ThemedText>
      <ThemedText>Year: {movie.year}</ThemedText>
      <ThemedText>Ratings: {movie.ratings}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  labelMovie: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "90%",
    maxWidth: 400,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 50,
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
  searchButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HomeScreen;
