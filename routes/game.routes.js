const router     = require("express").Router();
const game       = require("../controllers/game.controller");
const { protect }= require("../middleware/auth.middleware");
const { validateGameResult } = require("../middleware/anticheat.middleware");

router.post("/start",  protect, game.startGame);
// FIX: anticheat validation added to /end
router.post("/end",    protect, validateGameResult, game.endGame);
router.get("/history", protect, game.history);

module.exports = router;
