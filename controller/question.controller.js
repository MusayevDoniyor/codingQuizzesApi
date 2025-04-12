const { isValidObjectId } = require("mongoose");
const Question = require("../models/question.schema");
const { getUserbyId } = require("../service/user.service");
const questionService = require("../service/question.service");

const createQuestion = async (req, res) => {
  try {
    const questionData = req.body;
    const userId = req.user?.id;

    const newQuestion = await questionService.createQuestion(
      questionData,
      userId
    );

    console.log(questionData, userId);

    res
      .status(201)
      .json({ message: "Question created successfully", newQuestion });
  } catch (err) {
    const errorMessages = {
      all_fields_required: "All fields are required",
      user_not_found: "User not found",
      invalid_options: "Options must be an array with at least 2 values",
    };

    if (errorMessages[err.message]) {
      return res.status(400).json({ message: errorMessages[err.message] });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

const getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await questionService.getQuestions(page, limit);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await questionService.getQuestionById(req.params.id);

    if (!question)
      return res.status(404).json({ message: "Question not found" });

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const updatedQuestionData = req.body;
    const updatedQuestionId = req.params.id;
    const userId = req.user?.id;

    const updatedQuestion = await questionService.updateQuestion(
      updatedQuestionId,
      updatedQuestionData,
      userId
    );

    res
      .status(200)
      .json({ message: "Question updated successfully", updatedQuestion });
  } catch (err) {
    const errorMessages = {
      question_not_found: "Question not found",
      user_not_found: "User not found",
    };

    if (errorMessages[err.message]) {
      return res.status(400).json({ message: errorMessages[err.message] });
    }

    res.status(500).json({ message: "Server error" });
    console.log(err);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await questionService.deleteQuestion(req.params.id);
    if (!deletedQuestion)
      return res.status(404).json({ message: "Question not found" });

    res.json({
      message: "Question deleted successfully",
      deletedQuestion,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRandomQuestions = async (req, res) => {
  const count = parseInt(req.query.count) || 5;

  try {
    const questions = await Question.aggregate([{ $sample: { size: count } }]);

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getQuestionsByCategory = async (req, res) => {
  const category = req.query.category;
  const size = parseInt(req.query.size) || 1;

  try {
    const questions = await questionService.getQuestionsByCategory(
      category,
      size
    );

    if (!questions.length)
      return res
        .status(404)
        .json({ error: "No questions found in this category" });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getRandomQuestions,
  getQuestionsByCategory,
};
