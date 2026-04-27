import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: Number,
  total: Number,
  answers: Array,
  examTitle: String,
  examType: String,
  answers: [String],
  questions: Array,
  timeSpent: [Number],
  totalTime: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Result", resultSchema);