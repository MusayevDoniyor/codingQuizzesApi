const { getUserbyId } = require("./user.service");
const Question = require("../models/question.schema");

const createQuestion = async (questionData, userId) => {
  const {
    question,
    difficulty,
    category,
    options,
    correctAnswer,
    explanation,
    tags,
    created_by,
    points,
  } = questionData;

  const questions = await getQuestions();

  if (
    !question ||
    !difficulty ||
    !category ||
    !options ||
    !correctAnswer ||
    !explanation ||
    !tags
  )
    throw new Error("all_fields_required");

  if (!Array.isArray(options) || options.length < 2)
    throw new Error("invalid_options");

  const creatorId = created_by || userId;
  const user = await getUserbyId(creatorId);

  if (!user) {
    throw new Error("user_not_found");
  }

  let finalPoints = points;
  if (!finalPoints) {
    const difficultyPoints = {
      easy: 3,
      medium: 5,
      hard: 7,
      advanced: 10,
    };
    finalPoints = difficultyPoints[difficulty] || 0;
  }

  const newQuestion = new Question({
    question,
    difficulty,
    category,
    options,
    correctAnswer,
    explanation,
    tags,
    created_by: creatorId,
    points: finalPoints,
  });

  return await newQuestion.save();
};

const getQuestions = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [questions, total] = await Promise.all([
    Question.find().skip(skip).limit(limit),
    Question.countDocuments(),
  ]);

  return { total, page, limit, questions };
};

const getQuestionById = async (id) => {
  const question = await Question.findById(id);
  if (!question) return null;

  return question;
};

const updateQuestion = async (id, questionData, userId) => {
  const {
    questionTitle,
    difficulty,
    category,
    options,
    correctAnswer,
    explanation,
    tags,
    created_by,
  } = questionData;

  const questionUserId = created_by || userId;

  if (Array.isArray(options) && options.length < 2) {
    throw new Error("invalid_options");
  }
  if (correctAnswer && !options.includes(correctAnswer)) {
    throw new Error("correct_answer_not_in_options");
  }

  const updatedQuestion = await Question.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(questionTitle && { question: questionTitle }),
        ...(difficulty && { difficulty }),
        ...(category && { category }),
        ...(Array.isArray(options) && options.length >= 2 && { options }),
        ...(correctAnswer && { correctAnswer }),
        ...(explanation && { explanation }),
        ...(created_by && { created_by }),
        ...(Array.isArray(tags) && { tags }),
      },
    },
    { new: true }
  );
  const user = await getUserbyId(questionUserId);

  if (!updatedQuestion) throw new Error("question_not_found");
  else if (!user) throw new Error("user_not_found");

  return await updatedQuestion.save();
};

const deleteQuestion = async (id) => {
  const question = await Question.findById(id);
  if (!question) return null;

  await question.deleteOne();
  return question;
};

const getQuestionsByCategory = async (category, size = 1) => {
  if (!category || typeof category !== "string")
    throw new Error("category_required");
  if (typeof size !== "number" || size <= 0) throw new Error("invalid_size");

  return await Question.aggregate([
    { $match: { category } },
    {
      $sample: { size: parseInt(size) },
    },
  ]);
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByCategory,
};
