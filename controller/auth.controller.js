const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    let existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    let user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const jwtSecretkey = process.env.JWT_SECRET_KEY;

    const passwordMatched = await user.matchPassword(password);

    if (!user || !passwordMatched)
      return res.status(400).json({ message: "Invalid credentials" });

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
};

module.exports = { signup, login };
