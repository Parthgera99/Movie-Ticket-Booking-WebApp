import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  address: {
    city: { type: String, required: true },
    area: { type: String },
    street: { type: String },
  },

  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  screens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Screen" }],
}, { timestamps: true });

cinemaSchema.index({ location: "2dsphere" });

export default mongoose.model("Cinema", cinemaSchema);
