

/*import express from 'express'; // Correct spelling of express
import { addMovie , getAllMovies, getMovieById} from '../controllers/movie-controller.js'; // Ensure the .js extension for ES modules

const movieRouter = express.Router();

// Define the POST route for adding a movie
movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/", addMovie);


export default movieRouter;
*/

import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
} from "../controllers/movie-controller.js";
const movieRouter = express.Router();
movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/", addMovie);

export default movieRouter;
