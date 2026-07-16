const router     = require("express").Router();
const auth       = require("../controllers/auth.controller");
const { protect }= require("../middleware/auth.middleware");
const { validateRegister, validateLogin } = require("../middleware/validator.middleware");

// Public
router.post("/register",   validateRegister, auth.register);
router.post("/login",      validateLogin,    auth.login);
router.post("/send-otp",                     auth.sendOTP);
router.post("/verify-otp",                   auth.verifyOTP);

// Protected
router.get("/me",     protect, auth.me);
router.post("/logout",protect, auth.logout);

module.exports = router;
