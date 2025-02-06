import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";
import Booking from "../models/Bookings.js";
import cosineSimilarity from "cosine-similarity";
import natural from "natural";

// Add Movie
export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];

  // Check if token is present
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  try {
    // Verify token asynchronously
    const decoded = jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decoded.id; // Extract admin ID from the token
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }

  // Validate input fields
  const { title, description, releaseDate, posterUrl, featured, actors } =
    req.body;
  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !posterUrl ||
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    // Create a new movie document
    movie = new Movie({
      title,
      description,
      releaseDate: new Date(releaseDate),
      featured,
      actors,
      admin: adminId,
      posterUrl,
    });

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    const adminUser = await Admin.findById(adminId).session(session); // Use session for transaction
    if (!adminUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Admin not found" });
    }

    // Save movie and associate with admin
    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    return res.status(500).json({ message: "Request Failed" });
  }

  if (!movie) {
    return res.status(500).json({ message: "Failed to create movie" });
  }

  return res.status(201).json({ movie });
};

const normalizeVector = (vector) => {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((val) => val / magnitude);
};

export const getAllMovies = async (req, res, next) => {
  const userId = req.query?.user;
  let movies;
  let recommendedMovies = [];
  try {
    movies = await Movie.find();
    if (userId && userId != null && userId != "null") {
      const bookings = await Booking.find({ user: userId }).populate("movie");
      if (bookings.length > 0) {
        const userGenres = bookings.map((booking) => booking.movie.description);
        const tfidf = new natural.TfIdf();
        movies.forEach((movie) => {
          tfidf.addDocument(movie.description);
        });

        const similarities = [];
        movies.forEach((movie, index) => {
          let genreSimilarity = 0;
          userGenres.forEach((userGenre) => {
            const movieVector = tfidf
              .listTerms(index)
              .map((term) => term.tfidf);
            const userGenreVector = new natural.TfIdf();
            userGenreVector.addDocument(userGenre);
            const userVec = userGenreVector
              .listTerms(0)
              .map((term) => term.tfidf);
            const normalizedMovieVec = normalizeVector(movieVector);
            const normalizedUserVec = normalizeVector(userVec);

            genreSimilarity += cosineSimilarity(
              normalizedMovieVec,
              normalizedUserVec
            );
          });
          similarities.push({ movie, similarity: genreSimilarity });
        });
        const maxSimilarity = Math.max(
          ...similarities.map((item) => item.similarity)
        );
        recommendedMovies = similarities
          .sort((a, b) => b.similarity - a.similarity)
          .map((item) => {
            const likelyUserPreference = (
              (item.similarity / maxSimilarity) *
              100
            ).toFixed(2); 
            return {
              ...item.movie.toObject(),
              recommendedScore: item.similarity,
              likelyUserPreference: likelyUserPreference, // Add the percentage
            };
          });

        if (recommendedMovies.length === 0) {
          recommendedMovies = movies.sort(
            (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
          );
        }

        if (recommendedMovies.length === 0) {
          recommendedMovies = movies.map((movie) => ({
            ...movie.toObject(),
            recommendedScore: 0, // Set score to 0 if not recommended
            likelyUserPreference: "0", // Set preference to 0 if no recommendations
          }));
        }
      }else{
							recommendedMovies = movies.map((movie) => ({
        ...movie.toObject(),
        recommendedScore: 0, // Set score to 0 if not recommended
        likelyUserPreference: "0", // Set preference to 0 if no recommendations
      }));
						}
    } else {
      recommendedMovies = movies.map((movie) => ({
        ...movie.toObject(),
        recommendedScore: 0, // Set score to 0 if not recommended
        likelyUserPreference: "0", // Set preference to 0 if no recommendations
      }));
    }
  } catch (err) {
			console.log(err)
    return res.status(500).json({ message: err.message });
  }

  return res.status(200).json({ movies: recommendedMovies });
};

// Get Movie by ID
export const getMovieById = async (req, res, next) => {
  const id = req.params.id;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Movie ID" });
  }

  let movie;
  let bookedSeats = [];
  try {
    movie = await Movie.findById(id);

    const bookings = await Booking.find({ movie: id }).select("seatNumber");
    bookedSeats = bookings.flatMap((booking) => booking.seatNumber);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.status(200).json({
    movie: {
      ...movie.toObject(),
      bookedSeats: bookedSeats,
    },
  });
};
