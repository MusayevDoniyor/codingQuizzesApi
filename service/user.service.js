const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const getUserbyId = async (id) => {
  let user = await User.findById(id).select("-password");
  return user;
};

const updateUserProfile = async (id, data) => {
  let user = await User.findById(id);
  if (!user) return null;

  if (data.username) user.username = data.username;
  if (data.email) user.email = data.email;

  await user.save();
  return user;
};

const updateUserPassword = async (id, password, newPassword) => {
  let user = await User.findById(id);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return "incorrect_password";
  if (newPassword.length < 6) return "short_password";

  user.password = password;

  await user.save();
  return user;
};

const deleteUser = async (id) => {
  let user = await User.findById(id);
  if (!user) return null;

  await User.deleteOne({ _id: user.id });
  return "deleted";
};

module.exports = {
  getUserbyId,
  updateUserProfile,
  updateUserPassword,
  deleteUser,
};
