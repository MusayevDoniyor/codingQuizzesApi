const User = require("../models/user.model");
const Question = require("../models/question.schema");
const Solve = require("../models/solve.model");

const getUsers = async (req, res) => {
  try {
    const [admins, users] = await Promise.all([
      User.find(
        { role: "admin" },
        "-password -role -total_points -achievements -solved_questions"
      ),
      User.find({ role: "user" }, "-password -role"),
    ]);

    res.status(200).json({
      admins: {
        count: admins.length,
        admins,
      },
      users: {
        count: users.length,
        users,
      },
    });
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

    res
      .status(200)
      .json({ stats: { totalUsers, totalQuestions, totalSubmissions } });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: "Server error" });
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "user"].includes(role))
    return res.status(400).json({ message: "Invalid role" });
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: `${user.username} is now ${role}` });
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
  updateRole,
};
