const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/(auth)/authController");
const router = express.Router();
const { protect } = require("../middleware/(auth)/auth");

// POST
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

module.exports = router;
