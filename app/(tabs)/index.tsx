import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useFocusEffect } from "@react-navigation/native";

interface Movie {
  title: string;
  director: string;
  year: number;
  ratings: number;
}

const HomeScreen: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  useFocusEffect(
    React.useCallback(() => {
      fetchMovies();
      console.log("tset");
    }, [])
  );

  const fetchMovies = async () => {
    try {
      const response = await fetch("http://192.168.100.5:3000/api/movies");
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
});

export default HomeScreen;
