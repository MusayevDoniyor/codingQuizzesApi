const express = require("express");
const Submission = require("../models/solve.model");
const Question = require("../models/question.schema");
const User = require("../models/user.model");
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
  let { userId, questionId, selectedOption, time_taken } = req.body;

  try {
    const question = await Question.findById(questionId);
    const user = await User.findById(userId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.includes(selectedOption)
      : question.correctAnswer === selectedOption;

    let points = 0;
    time_taken = time_taken / 1000;

    if (isCorrect) {
      switch (question.difficulty) {
        case "easy":
          points = 3;
          break;
        case "medium":
          points = 5;
          break;
        case "hard":
          points = 7;
          break;
        case "advanced":
          points = 10;
          break;
        default:
          points = 0;
          break;
      }
    }

    const submission = new Submission({
      userId,
      questionId,
      selectedOption,
      isCorrect,
      points,
      time_taken,
    });

    user.total_points += points;
    await user.save();

    const savedSubmission = await submission.save();
    res.status(201).json(savedSubmission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
