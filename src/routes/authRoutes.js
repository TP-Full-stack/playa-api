const express = require("express");
const { signup, login } = require("../controllers/(auth)/authController");

const router = express.Router();

// POST

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
