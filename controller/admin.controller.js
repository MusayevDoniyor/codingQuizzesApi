const User = require("../models/user.model");
const Question = require("../models/question.schema");
const Solve = require("../models/solve.model");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";

    await user.save();
    res.status(200).json({ message: `${user.username} is now admin` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const removeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "user";
    await user.save();
    res.status(200).json({ message: `${user.username} is now user` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getStats = async (req, res) => {
  try {
    const [totalUsers, totalQuestions, totalSubmissions] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Solve.countDocuments(),
    ]);

    res.status(200).json({ totalUsers, totalQuestions, totalSubmissions });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  makeAdmin,
  removeAdmin,
  getStats,
};
