const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware.js");

const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getRandomQuestions,
  getQuestionsByCategory,
} = require("../controller/question.controller.js");
const validateObjectId = require("../middlewares/validateObjectId.js");

router.get("/random", getRandomQuestions);
router.get("/category", getQuestionsByCategory);

router
  .route("/")
  .get(getQuestions)
  .post(
    authMiddleware(["admin"]),
    validateObjectId(["created_by"]),
    createQuestion
  );

router
  .route("/:id")
  .get(validateObjectId(), getQuestionById)
  .put(
    authMiddleware(["admin"]),
    validateObjectId(["id", "created_by"]),
    updateQuestion
  )
  .delete(authMiddleware(["admin"]), validateObjectId(), deleteQuestion);

module.exports = router;
