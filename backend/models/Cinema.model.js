import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  screens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Screen" }]
}, { timestamps: true });

export default mongoose.model("Cinema", cinemaSchema);
