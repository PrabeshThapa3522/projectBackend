
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";

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
  const { title, description, releaseDate, posterUrl, featured, actors } = req.body;
  if (!title || title.trim() === "" || !description || description.trim() === "" || !posterUrl || posterUrl.trim() === "") {
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
      posterUrl
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

// Get All Movies
export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

// Get Movie by ID
export const getMovieById = async (req, res, next) => {
  const id = req.params.id;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Movie ID" });
  }

  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.status(200).json({ movie });
};


