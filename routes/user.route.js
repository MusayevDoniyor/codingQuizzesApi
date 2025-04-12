const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  deleteUser,
} = require("../controller/user.controller");
const validateObjectId = require("../middlewares/validateObjectId");

const router = express.Router();
router.get("/:id", validateObjectId(), authMiddleware(), getUserProfile);
router.put("/:id", validateObjectId(), authMiddleware(), updateUserProfile);
router.delete("/:id", validateObjectId(), authMiddleware(), deleteUser);
router.put(
  "/:id/password",
  validateObjectId(),
  authMiddleware(),
  updateUserPassword
);
module.exports = router;
