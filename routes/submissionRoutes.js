const express = require("express");
const Submission = require("../models/submission");
const Question = require("../models/question");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/random", async (req, res) => {
  const count = parseInt(req.query.count) || 1;
  try {
    const submissions = await Submission.aggregate([
      { $sample: { size: count } },
    ]);
    console.log(submissions);

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { userId, questionId, selectedOption } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const isCorrect = question.correctAnswer === selectedOption;
    const submission = new Submission({
      userId,
      questionId,
      selectedOption,
      isCorrect,
    });

    const savedSubmission = await submission.save();
    res.status(201).json(savedSubmission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
