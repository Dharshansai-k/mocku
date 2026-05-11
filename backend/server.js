import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import resultRoutes from "./routes/result.js";
import examRoutes from "./routes/exam.js";

dotenv.config();

const app = express();


// ✅ Middleware
app.use(cors());

app.use(express.json());


// ✅ Routes
app.use("/api/auth", authRoutes);

app.use("/api/results", resultRoutes);

app.use("/api/exams", examRoutes);


// ✅ Test Route
app.get("/", (req, res) => {
  res.send("MockU API running 🚀");
});


// ✅ PORT
const PORT = process.env.PORT || 5000;


// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

  })
  .catch((err) => {

    console.log("MongoDB Error ❌");
    console.log(err);

  });