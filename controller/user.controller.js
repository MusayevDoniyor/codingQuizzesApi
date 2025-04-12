const checkPermission = require("../utils/helper");
const userServices = require("../service/user.service");

const getUserProfile = async (req, res) => {
  try {
    const user = await userServices.getUserbyId(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!checkPermission(req, user._id.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await userServices.updateUserProfile(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!checkPermission(req, user._id)) {
      console.log("Access denied");

      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, password } = req.body;
    const user = await userServices.updateUserPassword(
      req.params.id,
      oldPassword,
      password
    );
    if (user === null)
      return res.status(404).json({ message: "User not found" });

    if (!checkPermission(req, user._id)) {
      console.log(req.user);
      console.log(user._id);
      console.log(user);

      return res.status(403).json({ message: "Access denied" });
    }
    if (user === "incorrect_password")
      return res.status(400).json({ message: "Old password is incorrect" });
    if (user === "short_password") {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log("deleting 1");
    const user = await userServices.getUserbyId(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log(user._id);
    console.log(user.id);

    if (!checkPermission(req, user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await userServices.deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  deleteUser,
};
