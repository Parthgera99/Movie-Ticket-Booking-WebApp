import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  screen: { type: mongoose.Schema.Types.ObjectId, ref: "Screen", required: true },
  startTime: { type: Date, required: true },
  price: { type: Number, default: 250 }, // ticket price
  bookedSeats: [String] // e.g. ["A1", "B3"]
}, { timestamps: true });

export default mongoose.model("Show", showSchema);
