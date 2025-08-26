import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["user", "admin"], default: "user" },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  refreshToken: { type: String }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
