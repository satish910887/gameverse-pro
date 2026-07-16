const express = require("express");

const router = express.Router();

const {
    register,
    login,
    sendOTP,
    verifyOTP,
    me
} = require("../controllers/auth.controller");

const {
    protect
} = require("../middleware/auth.middleware");

/* ==========================
   Public Routes
========================== */

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Send OTP
router.post("/send-otp", sendOTP);

// Verify OTP
router.post("/verify-otp", verifyOTP);

/* ==========================
   Protected Routes
========================== */

// Current Logged-in User
router.get("/me", protect, me);

/* ==========================
   Export
========================== */

module.exports = router;
