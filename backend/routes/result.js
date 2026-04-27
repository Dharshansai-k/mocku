import express from "express";
import Result from "../models/Result.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ✅ SAVE RESULT
router.post("/", async (req, res) => {
  try {
    const result = await Result.create(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ ADMIN: GET ALL RESULTS (🔥 MUST COME FIRST)
router.get("/all", auth, adminOnly, async (req, res) => {
  try {
    const results = await Result.find().populate("userId", "name email");
    res.json(results);
  } catch (err) {
    console.log("Result error:", err);
    res.status(500).json({ msg: "Error fetching results" });
  }
});

// ✅ GET ALL (general)
router.get("/", async (req, res) => {
  const results = await Result.find();
  res.json(results);
});

// ✅ GET USER RESULTS (specific route)
router.get("/user/:userId", async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ❌ KEEP THIS LAST ALWAYS
router.get("/:userId", async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;