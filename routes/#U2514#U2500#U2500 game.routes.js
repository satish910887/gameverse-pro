const express = require("express");

const router = express.Router();

const {
    startGame,
    endGame,
    submitScore,
    history
} = require("../controllers/game.controller");

const {
    protect
} = require("../middleware/auth.middleware");

const {
    validateScore
} = require("../middleware/anticheat.middleware");

/* ==========================
   Start Game
========================== */

router.post(
    "/start",
    protect,
    startGame
);

/* ==========================
   End Game
========================== */

router.post(
    "/end",
    protect,
    validateScore,
    endGame
);

/* ==========================
   Submit Score
========================== */

router.post(
    "/submit",
    protect,
    validateScore,
    submitScore
);

/* ==========================
   Game History
========================== */

router.get(
    "/history",
    protect,
    history
);

/* ==========================
   Export
========================== */

module.exports = router;
