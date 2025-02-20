const express = require("express");
const router = express.Router();
const Question = require("../models/question.schema.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.post("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question)
      return res.status(404).json({ message: "Question not found" });

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!question)
      return res.status(404).json({ message: "Question not found" });

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question)
      return res.status(404).json({ message: "Question not found" });

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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

  if (!category) res.status(400).json({ error: "Category is required" });

  try {
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
