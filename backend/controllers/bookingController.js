import mongoose from "mongoose";
import Show from "../models/Show.model.js";
import Screen from "../models/Screen.model.js";
import Booking from "../models/Booking.model.js";
import User from "../models/User.model.js";
import {
  normalizeSeatLabel,
  isSeatWithinLayout,
  parseSeatLabel,
} from "../utils/seatUtils.js";

// helper to generate a simple booking reference
function generateReference(prefix = "BK") {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${rnd}`;
}

export const bookTickets = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const showId = req.params.id;
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId)
      return res
        .status(401)
        .json({ message: "Unauthorized: user not found on request" });

    let { seats } = req.body;
    if (!Array.isArray(seats) || seats.length === 0)
      return res.status(400).json({ message: "seats array is required" });

    // normalize seat labels
    seats = seats.map((s) => normalizeSeatLabel(s));

    if (seats.length > 6)
      return res.status(400).json({ message: "Maximum 6 seats per booking" });

    await session.withTransaction(async () => {
      const show = await Show.findById(showId).session(session);
      if (!show) throw new Error("Show not found");

      // check if any requested seat is already booked
      const already = seats.filter((s) => show.bookedSeats.includes(s));
      if (already.length)
        throw new Error(`Seats already booked: ${already.join(", ")}`);

      // validate seats against screen layout
      const screen = await Screen.findById(show.screen).session(session);
      if (!screen) throw new Error("Screen not found for this show");

      for (const seat of seats) {
        if (!isSeatWithinLayout(seat, screen.seatLayout)) {
          throw new Error(`Seat ${seat} is outside the screen layout`);
        }
      }

      // append seats to show.bookedSeats
      show.bookedSeats.push(...seats);
      await show.save({ session });

      const totalPrice = seats.length * (show.price || 0);

      const booking = new Booking({
        user: userId,
        show: showId,
        seats,
        totalPrice,
        status: "confirmed",
      });

      await booking.save({ session });

      // push booking to user
      await User.findByIdAndUpdate(
        userId,
        { $push: { bookings: booking._id } },
        { session }
      );

      // (optional) attach a reference code
      // NOTE: bookingSchema does not have reference field; if you want one, add it to the schema
      // For now return generated reference in response only

      res
        .status(201)
        .json({
          bookingId: booking._id,
          seats: booking.seats,
          totalPrice,
          reference: generateReference(),
        });
    });
  } catch (err) {
    console.error("booking error", err);
    // when inside transaction, throw will abort transaction
    const msg = err.message || "Booking failed";
    // map some errors to 409 conflict when seats already booked
    if (msg && msg.startsWith("Seats already booked"))
      return res.status(409).json({ message: msg });
    return res.status(400).json({ message: msg });
  } finally {
    await session.endSession();
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: [
          { path: "movie" },
          { path: "screen", populate: { path: "cinema" } },
        ],
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate({
      path: "show",
      populate: [
        { path: "movie" },
        { path: "screen", populate: { path: "cinema" } },
      ],
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // if user, ensure it belongs to them
    const userId = req.user && (req.user._id || req.user.id);
    if (
      req.user &&
      req.user.role !== "admin" &&
      booking.user.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params; // booking id
    const userId = req.user && (req.user._id || req.user.id);

    await session.withTransaction(async () => {
      const booking = await Booking.findById(id).session(session);
      if (!booking) throw new Error("Booking not found");

      // permission check
      if (
        req.user.role !== "admin" &&
        booking.user.toString() !== userId.toString()
      ) {
        throw new Error("Forbidden");
      }

      if (booking.status === "cancelled") throw new Error("Already cancelled");

      // simple time check could go here (e.g., disallow cancellation <= 30 min before show)
      const show = await Show.findById(booking.show).session(session);
      if (!show) throw new Error("Related show not found");

      // remove seats from show.bookedSeats
      show.bookedSeats = show.bookedSeats.filter(
        (s) => !booking.seats.includes(s)
      );
      await show.save({ session });

      booking.status = "cancelled";
      await booking.save({ session });

      // (Optional) Issue refund here if integrated with payment gateway

      res.json({ message: "Booking cancelled" });
    });
  } catch (err) {
    console.error(err);
    const msg = err.message || "Cancel failed";
    if (msg === "Forbidden") return res.status(403).json({ message: msg });
    return res.status(400).json({ message: msg });
  } finally {
    await session.endSession();
  }
};
