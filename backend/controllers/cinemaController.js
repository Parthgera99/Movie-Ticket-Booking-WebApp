import Cinema from "../models/Cinema.model.js";
import Screen from "../models/Screen.model.js";

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

// GET /cinema/list?city=ambala&area=sector-7&street=sector-7
export const getCinemasByCity = async (req, res) => {
  try {
    const { city, area, street } = req.query;

    const query = {};
    if (city) query["address.city"] = city;
    if (area) query["address.area"] = area;
    if (street) query["address.street"] = street;

    const cinemas = await Cinema.find(query).select("name address location");
    res.json(cinemas);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cinemas", error: err.message });
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