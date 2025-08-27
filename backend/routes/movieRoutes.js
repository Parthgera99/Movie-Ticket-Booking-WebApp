import express from 'express';
import { createMovie, getAllMovies, getMovieDetails, updateMovie, deleteMovie } from '../controllers/movieController.js';
import { verifyAdmin } from '../middleware/adminAuth.js';


const movieRouter = express.Router();


movieRouter.post('/', verifyAdmin, createMovie);
movieRouter.get('/', getAllMovies);
movieRouter.get('/:id', getMovieDetails);
movieRouter.put('/:id', verifyAdmin, updateMovie);
movieRouter.delete('/:id', verifyAdmin, deleteMovie);


export default movieRouter;