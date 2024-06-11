import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface Movie {
  title: string;
  director: string;
  year: number;
  ratings: number;
}

// Assuming movie data is available in the following format
const movies: Movie[] = [
  {
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    ratings: 8.8,
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    ratings: 9.0,
  },

  // Add more movie data as needed
];

const HomeScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {movies.map((movie, index) => (
        <MovieCard key={index} movie={movie} />
      ))}
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
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "90%", // 90% width of the screen
    maxWidth: 400, // Maximum width of 400 units
  },
});

export default HomeScreen;
