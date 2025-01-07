const express = require("express");
const Question = require("../models/question");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/random", async (req, res) => {
  const count = parseInt(req.query.count) || 5;
  try {
    const questions = await Question.aggregate([{ $sample: { size: count } }]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/category", async (req, res) => {
  const category = req.query.category;
  const size = parseInt(req.query.size) || 1;

  try {
    if (!category) res.status(400).json({ error: "Category is required" });

    const questions = await Question.aggregate([
      { $match: { category } },
      { $sample: { size } },
    ]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
