import express from "express";
import Exam from "../models/Exam.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ➕ Add exam
router.post("/", auth, adminOnly, async (req, res) => {
  const exam = await Exam.create(req.body);
  res.json(exam);
});

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.json(exam);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create exam" });
  }
});

// 📥 Get all exams
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    const exams = type
      ? await Exam.find({ type })
      : await Exam.find();

    res.json(exams);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;