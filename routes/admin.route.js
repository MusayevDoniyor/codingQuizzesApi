const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
  getUsers,
  makeAdmin,
  removeAdmin,
  getStats,
} = require("../controller/admin.controller");

router.get("/users", authMiddleware(["admin"]), getUsers);
router.put("/:id/make-admin", authMiddleware(["admin"]), makeAdmin);
router.put("/:id/remove-admin", authMiddleware(["admin"]), removeAdmin);
router.get("/stats", authMiddleware(["admin"]), getStats);

module.exports = router;
