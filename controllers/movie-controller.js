/*import jwt from 'jsonwebtoken';
import Movie from "../models/Movie.js";
export const addMovie = async (req, res, next) => {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header is missing or malformed" });
    }

    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.split(" ")[1];

    // Ensure the token is not empty
    if (!token || token.trim() === "") {
      return res.status(404).json({ message: "Token Not Found" });
    }

    // Log the extracted token (for debugging purposes)
    console.log("Extracted Token:", token);

    // Proceed with additional logic (e.g., token validation or adding the movie)
    res.status(200).json({ message: "Token received successfully" });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error in addMovie:", error.message);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }

 let adminId;

  // verify token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  //create new movie
  const { title, description, releaseDate, posterUrl, featured, actors } =
    req.body;
  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() == "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      admin: adminId,
      posterUrl,
      title,
    });
    movie = await movie.save();
  } catch (err) {
    return console.log(err);
  }
  if (!movie) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ movie });


};


import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Movie from '../models/Movie.js'; // Adjust path based on the actual file location
import Admin from '../models/Admin.js'; // Adjust the path based on the location of your Admin model



export const addMovie = async (req, res, next) => {
  // Extract token from Authorization header
  const extractedToken = req.headers.authorization.split(" ")[1];
  
  // Ensure the token exists and is not an empty string
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }
  let adminId;

  // verify token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });
  
  //create new movie
  const { title, description, releaseDate, posterUrl, featured, actors } =
    req.body;
  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() == "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      admin: adminId,
      posterUrl,
      title,
    });
   
    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();
    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();

  } catch (err) {
    return console.log(err);
  }
  if (!movie) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ movie });

  
  
};
export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";
export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  // verify token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  //create new movie
  const { title, description, releaseDate, posterUrl, featured, actors } =
    req.body;
  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() == "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      admin: adminId,
      posterUrl,
      title,
    });
    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();
    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ movie });
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};*/

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

