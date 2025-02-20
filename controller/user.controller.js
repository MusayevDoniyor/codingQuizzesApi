const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Update body", req.body);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // if (req.user.id !== user._id.toString() && req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    if (username) user.username = username;
    if (email) user.email = email;

    if (password && password.length >= 6) {
      console.log(password);
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (!isSamePassword) {
        user.password = await bcrypt.hash(password, 10);
      }
    } else {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // user.password = await bcrypt.hash(password, 10);
    user.password = password;
    console.log(user, password);

    await User.findByIdAndUpdate(req.params.id, user, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserProfile, updateUserProfile };
