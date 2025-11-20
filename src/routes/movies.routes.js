import { Router } from "express";
import {
  addMovie,
  getMovies,
  getMoviesByGenre,
  rateMovie
} from "../controllers/movies.controller.js";

const router = Router();

router.post("/", addMovie);
router.get("/", getMovies);
router.get("/genre/:genre", getMoviesByGenre);
router.post("/:movieId/rate", rateMovie);

export default router;
