import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs";
import Exam from "./models/Exam.js";

const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(path, "utf-8"));

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Exam.deleteMany();

    const exams = [
      loadJSON("./data/jee_mock.json"),
      loadJSON("./data/gate_mock.json"),
      loadJSON("./data/rbi_mock.json"),
      loadJSON("./data/neet_mock.json"),
      loadJSON("./data/upsc_mock.json"),
      loadJSON("./data/ssc_mock.json"),
    ];

    await Exam.insertMany(exams);

    console.log("✅ All exams seeded successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seed();