import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  cinema: { type: mongoose.Schema.Types.ObjectId, ref: "Cinema", required: true },
  name: { type: String, required: true },
  seatLayout: {
    rows: { type: Number, default: 10 },
    cols: { type: Number, default: 10 }
  },
  shows: [{ type: mongoose.Schema.Types.ObjectId, ref: "Show" }]
}, { timestamps: true });

export default mongoose.model("Screen", screenSchema);
