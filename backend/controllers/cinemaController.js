import Cinema from "../models/Cinema.model.js";
import Show from "../models/Show.model.js";
import Screen from "../models/Screen.model.js";
import mongoose from "mongoose";

// Create Cinema (Admin Only)
export const createCinema = async (req, res) => {
  try {
    const { name, address, location } = req.body;

    const cinema = new Cinema({
      name,
      address,
      location,
      owner: req.user.id
    });

    await cinema.save();
    res.status(201).json(cinema);
  } catch (error) {
    res.status(500).json({ message: "Error creating cinema", error: error.message });
  }
};

// GET /cinema/list?city=Ambala&movieId=xxx
export const getCinemasByCity = async (req, res) => {
  try {
    const { city, movieId } = req.query;

    if (!city || !movieId)
      return res.status(400).json({ message: "City and movieId required" });

    const movieObjectId = mongoose.Types.ObjectId.createFromHexString(movieId);

    // Step 1: Get cinemas in the city
    const cinemas = await Cinema.find({ 
      "address.city": { $regex: new RegExp(`^${city}$`, "i") } 
    });


    console.log(cinemas)

    // Step 2: For each cinema, get screens that have shows for this movie
    const result = await Promise.all(
      cinemas.map(async (cinema) => {
        // Populate shows for each screen
        const screens = await Screen.find({ cinema: cinema._id }).populate({
          path: "shows",
          match: { movie: movieObjectId, startTime: { $gte: new Date() } },
          options: { sort: { startTime: 1 } },
        });

        console.log("screens", screens)

        // Filter out screens with no shows for this movie
        const screensWithShows = screens
          .filter((screen) => screen.shows && screen.shows.length > 0)
          .map((screen) => screen.toObject());

        if (screensWithShows.length === 0) return null;

        return {
          _id: cinema._id,
          name: cinema.name,
          address: cinema.address,
          location: cinema.location,
          screens: screensWithShows,
        };
      })
    );

    // Return only cinemas that have screens with shows
    res.json(result.filter(Boolean));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching cinemas", error: err.message });
  }
};


// GET /cinema/:id/details
export const getCinemaDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const cinema = await Cinema.findById(id)
      .populate({
        path: "screens",
        populate: {
          path: "shows",
          populate: { path: "movie", select: "title genre duration" }
        }
      });

    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    res.json(cinema);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cinema details", error: err.message });
  }
};


// GET /cinema/:cinemaId/movies/:movieId/shows
export const getMovieShows = async (req, res) => {
  try {
    const { cinemaId, movieId } = req.params;

    const cinema = await Cinema.findById(cinemaId).populate({
      path: "screens",
      populate: {
        path: "shows",
        match: { movie: movieId },
        populate: { path: "movie" } // get full movie object, not just title
      }
    });

    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    // Extract matched shows with populated objects
    const shows = [];
    cinema.screens.forEach(screen => {
      screen.shows.forEach(show => {
        if (show.movie && show.movie._id.toString() === movieId) {
          shows.push({
            screen: {
              _id: screen._id,
              name: screen.name,
            },
            show: {
              _id: show._id,
              movie: show.movie,           // full movie object
              startTime: show.startTime,
              endTime: show.endTime,
              price: show.price
            }
          });
        }
      });
    });

    res.json({
      cinema: {
        _id: cinema._id,
        name: cinema.name,
        address: cinema.address
      },
      movieId,
      shows
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching shows", error: err.message });
  }
};



// Get nearest cinemas
export const getNearestCinemas = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const cinemas = await Cinema.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      },
    });

    res.status(200).json(cinemas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching nearest cinemas" });
  }
};