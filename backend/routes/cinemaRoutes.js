import express from "express";
import { createCinema,getCinemaDetails, getMovieShows, getNearestCinemas, getCinemasByCity } from "../controllers/cinemaController.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const router = express.Router();


router.post("/", verifyAdmin, createCinema); // Create a cinema
router.get("/:id/details", getCinemaDetails); // Get cinema info - name, address, location, owner and movies data
router.get("/list", getCinemasByCity); // Get cinemas by city/area
router.get("/nearest", getNearestCinemas); // Get nearest cinemas based on user's lat/lng
router.get("/:cinemaId/movies/:movieId/shows", getMovieShows); 

export default router;
