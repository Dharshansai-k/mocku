import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  subject: String,
  difficulty: String,
});

const examSchema = new mongoose.Schema({
  title: String,       // "JEE Mock 1"
  type: String,        // "JEE", "GATE", "RBI"
  duration: Number,    // in minutes
  totalMarks: Number,

  questions: [questionSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Exam", examSchema);