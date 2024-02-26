const express = require("express");
const { register, login, logout, getMe } = require("../controllers/auth.js");

const router = express.Router();

const { protect } = require("../middleware/auth.js");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);

module.exports = router;
