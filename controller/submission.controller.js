const Submission = require("../models/solve.model");
const Question = require("../models/question.schema");
const User = require("../models/user.model");

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

const getRandomSubmissions = async (req, res) => {
  const count = parseInt(req.query.count) || 1;

  try {
    const submissions = await Submission.aggregate([
      { $sample: { size: count } },
    ]);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

const postSubmission = async (req, res) => {
  let { questionId, selectedOption, time_taken = 0 } = req.body;
  const userId = req.user.id || req.body.userId;

  if (!selectedOption)
    return res
      .status(400)
      .json({ message: "Missing required fields: selectedOption" });

  try {
    const [question, user] = await Promise.all([
      Question.findById(questionId),
      User.findById(userId),
    ]);

    if (!question) return res.status(404).json({ error: "Question not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.includes(selectedOption)
      : question.correctAnswer === selectedOption;

    let points = 0;
    time_taken = Math.round(time_taken / 1000);

    if (isCorrect) {
      const difficultyPoints = {
        easy: 3,
        medium: 5,
        hard: 7,
        advanced: 10,
      };

      points = difficultyPoints[question.difficulty] || 0;
    }

    const previousAttempt = user.solved_questions.find(
      (q) => q.question_id.toString() === questionId
    );

    if (previousAttempt) {
      if (previousAttempt.isCorrect) {
        points = 0;
      } else {
        previousAttempt.isCorrect = isCorrect;
        previousAttempt.points = points;
      }
    } else {
      user.solved_questions.push({
        question_id: questionId,
        isCorrect,
        points,
      });
    }

    const submission = new Submission({
      userId,
      questionId,
      selectedOption,
      isCorrect,
      points,
      time_taken,
    });

    user.total_points = (user.total_points || 0) + points;

    await Promise.all([user.save(), submission.save()]);

    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ error: "Server error: " + err.message });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    await submission.deleteOne();
    res.json({
      message: "Submission deleted successfully",
      deletedQuestion: submission,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllSubmissions,
  getRandomSubmissions,
  postSubmission,
  deleteSubmission,
};
