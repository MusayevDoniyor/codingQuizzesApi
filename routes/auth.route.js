const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/auth.controller");
const { getUploader } = require("../middlewares/upload");

const upload = getUploader("users");

router.post("/register", upload.single("image"), register);
router.post("/login", login);

module.exports = router;
