import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";

import resultRoutes from "./routes/result.js";

import examRoutes from "./routes/exam.js";


dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
//result routes
app.use("/api/results", resultRoutes);
// test route
app.get("/", (req, res) => {
  res.send("MockU API running 🚀");
});

//exam route
app.use("/api/exams", examRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on ${process.env.PORT}`)
    );
  })
  .catch(err => console.log(err));