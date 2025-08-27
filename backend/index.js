import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import cinemaRoutes from "./routes/cinemaRoutes.js"
import movieRoutes from "./routes/movieRoutes.js";
import screenRoutes from "./routes/screenRoutes.js";
import showRoutes from "./routes/showRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config({
    path: "./.env",
});
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.29.237:3000"], // 👈 allowed frontends
    credentials: true, // 👈 allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cinema",cinemaRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/screen", screenRoutes);
app.use("/api/show", showRoutes);
app.use("/api/booking", bookingRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));


