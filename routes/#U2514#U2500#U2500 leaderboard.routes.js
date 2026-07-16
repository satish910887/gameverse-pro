const express = require("express");

const router = express.Router();

const {
    getLeaderboard,
    topPlayers,
    playerRank,
    recentWinners
} = require("../controllers/leaderboard.controller");

const {
    protect
} = require("../middleware/auth.middleware");

/* ==========================
   Public Routes
========================== */

// Global / Game Leaderboard
router.get(
    "/",
    getLeaderboard
);

// Top Players
router.get(
    "/top",
    topPlayers
);

// Recent Winners
router.get(
    "/winners",
    recentWinners
);

/* ==========================
   Protected Routes
========================== */

// Current User Rank
router.get(
    "/rank",
    protect,
    playerRank
);

/* ==========================
   Export
========================== */

module.exports = router;
