import Screen from "../models/Screen.model.js";
import Cinema from "../models/Cinema.model.js";

export const createScreen = async (req, res) => {
  try {
    const { cinemaId } = req.params; // router mounted with mergeParams
    console.log(cinemaId)
    const { name, seatLayout } = req.body;
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });

    const screen = await Screen.create({ cinema: cinemaId, name, seatLayout });
    // cinema.screens.push(screen._id);
    await cinema.save();

    res.status(201).json(screen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getScreensByCinema = async (req, res) => {
  try {
    const { cinemaId } = req.params;
    const screens = await Screen.find({ cinema: cinemaId }).populate("shows");
    res.json(screens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getScreenDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id).populate({
      path: "shows",
      populate: { path: "movie" },
    });
    if (!screen) return res.status(404).json({ message: "Screen not found" });
    res.json(screen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await Screen.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return res.status(404).json({ message: "Screen not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findByIdAndDelete(id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    // remove reference from cinema
    await Cinema.findByIdAndUpdate(screen.cinema, {
      $pull: { screens: screen._id },
    });

    res.json({ message: "Screen deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
