import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth, adminOnly } from "../middleware/auth.js";


const router = express.Router();   // ✅ THIS WAS MISSING


// 🔐 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({ msg: "User registered", user });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// 🔑 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
  {
    id: user._id,
    role: user.role,   // 🔥 REQUIRED
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/all", auth, adminOnly, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.put("/update", auth, async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone },
    { returnDocument: "after" }
  );

  res.json(user);
});



// 🔍 GET ALL USERS (for testing)
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;   // ✅ IMPORTANT