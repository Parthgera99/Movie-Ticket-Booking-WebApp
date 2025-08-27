import Show from "../models/Show.model.js";
import Screen from "../models/Screen.model.js";
import Movie from "../models/Movie.model.js";

export const createShow = async (req, res) => {
  try {
    const { screenId } = req.params; // router mounted as /screens/:screenId/shows
    let { movie: movieId, startTime, endTime, price } = req.body;

    if (!movieId || !startTime)
      return res
        .status(400)
        .json({ message: "movie and startTime are required" });

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    startTime = new Date(startTime);
    if (isNaN(startTime))
      return res.status(400).json({ message: "Invalid startTime" });

    if (!endTime) {
      endTime = new Date(startTime.getTime() + movie.duration * 60000);
    } else {
      endTime = new Date(endTime);
    }

    if (startTime >= endTime)
      return res
        .status(400)
        .json({ message: "startTime must be before endTime" });

    // check for overlapping shows on same screen
    const overlap = await Show.findOne({
      screen: screenId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlap)
      return res
        .status(400)
        .json({
          message: "Showtime overlaps with an existing show",
          overlapId: overlap._id,
        });

    const show = await Show.create({
      movie: movieId,
      screen: screenId,
      startTime,
      endTime,
      price,
    });
    await Screen.findByIdAndUpdate(screenId, { $push: { shows: show._id } });

    res.status(201).json(show);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getShowsByScreen = async (req, res) => {
  try {
    const { screenId } = req.params;
    const shows = await Show.find({ screen: screenId }).populate("movie");
    res.json(shows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getShowDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id)
      .populate({ path: "movie" })
      .populate({ path: "screen" });
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // if times are changed, double-check overlapping logic
    if (payload.startTime || payload.endTime) {
      const show = await Show.findById(id);
      if (!show) return res.status(404).json({ message: 'Show not found' });

      const startTime = payload.startTime ? new Date(payload.startTime) : show.startTime;
      const endTime = payload.endTime ? new Date(payload.endTime) : show.endTime;
      if (startTime >= endTime) return res.status(400).json({ message: 'Invalid time range' });

      const conflict = await Show.findOne({
        _id: { $ne: id },
        screen: show.screen,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      });
      if (conflict) return res.status(400).json({ message: 'Updated times conflict with another show', conflictId: conflict._id });
    }

    const updated = await Show.findByIdAndUpdate(id, payload, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findByIdAndDelete(id);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    await Screen.findByIdAndUpdate(show.screen, { $pull: { shows: show._id } });
    res.json({ message: 'Show deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};