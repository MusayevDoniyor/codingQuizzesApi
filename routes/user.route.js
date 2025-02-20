const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controller/user.controller");

const router = express.Router();

router.get("/:id", authMiddleware(), getUserProfile);
router.put("/:id", authMiddleware(), updateUserProfile);
module.exports = router;
