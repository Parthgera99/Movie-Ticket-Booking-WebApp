import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: { type: Number, required: true }, // in minutes
  language: [{type: String}],
  posterUrl: String,
  genre: [{type: String}],
  rating: { type: Number, min: 0, max: 10 } // optional IMDb-style rating
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);
