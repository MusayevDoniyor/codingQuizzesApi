const express = require("express");
const validateObjectId = require("../middlewares/validateObjectId");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  getAllSubmissions,
  getRandomSubmissions,
  postSubmission,
  deleteSubmission,
} = require("../controller/submission.controller");
const router = express.Router();

router.get("/", authMiddleware(), getAllSubmissions);
router.get("/random", authMiddleware(["admin"]), getRandomSubmissions);
router.post(
  "/",
  authMiddleware(),
  validateObjectId(["questionId", "userId"]),
  postSubmission
);
router.delete(
  "/:id",
  validateObjectId(),
  authMiddleware(["admin"]),
  deleteSubmission
);

module.exports = router;
