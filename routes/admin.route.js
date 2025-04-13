const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
  getUsers,
  getStats,
  updateRole,
} = require("../controller/admin.controller");

router.get("/users", authMiddleware(["admin"]), getUsers);
router.put("/:id/update-role", authMiddleware(["admin"]), updateRole);
router.get("/stats", authMiddleware(["admin"]), getStats);

module.exports = router;
