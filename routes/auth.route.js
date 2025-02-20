require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const jwtSecretkey = process.env.JWT_SECRET_KEY;

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login body", req.body);
    const user = await User.findOne({ email });
    console.log("Login user", user);

    console.log("Password", password);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const passwordMatched = await user.matchPassword(password);
    if (!passwordMatched)
      return res.status(400).json({ message: "Invalid credentials password" });

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecretkey, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
