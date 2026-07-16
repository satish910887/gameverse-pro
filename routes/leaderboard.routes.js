const express = require("express");

const router = express.Router();

const leaderboardController = require("../controllers/leaderboard.controller");
const { protect } = require("../middleware/auth.middleware");

// Public Routes

// Global Leaderboard
router.get("/", leaderboardController.getLeaderboard);

// Top Players
router.get("/top", leaderboardController.topPlayers);

// Protected Routes

// Current User Rank
router.get("/my-rank", protect, leaderboardController.getMyRank);

module.exports = router;
