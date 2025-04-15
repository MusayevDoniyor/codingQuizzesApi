const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const questionRoutes = require("./question.route");
const submissionRoutes = require("./solve.route");
const adminRoutes = require("./admin.route");
const userRoutes = require("./user.route");

router.get("/", (req, res) => {
  res.send("Welcome to the Coding Quizzes API!");
});

router.use("/api/auth", authRoutes);
router.use("/api/questions", questionRoutes);
router.use("/api/solve", submissionRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api/user", userRoutes);

module.exports = router;
