import Movie from "../models/Movie.model.js";

export const createMovie = async (req, res) => {
  try {
    const payload = req.body;
    const movie = await Movie.create(payload);
    res.status(201).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const { genre, language, minRating, page = 1, limit = 20, q } = req.query;
    const filter = {};

    if (genre) filter.genre = { $in: genre.split(",") };
    if (language) filter.language = { $in: language.split(",") };
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (q) filter.title = { $regex: q, $options: "i" };

    const movies = await Movie.find(filter)
      .sort({ createdAt: -1 }) // latest movies first
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.json({ message: "Movie deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
