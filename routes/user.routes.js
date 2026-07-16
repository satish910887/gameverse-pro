const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

// Get User Profile
router.get("/profile", protect, userController.getProfile);

// Update User Profile
router.put("/profile", protect, userController.updateProfile);

// User Statistics
router.get("/stats", protect, userController.getStats);

// Add Coins (Game Rewards)
router.post("/coins", protect, userController.addCoins);

// Add XP (Game Rewards)
router.post("/xp", protect, userController.addXP);

module.exports = router;
