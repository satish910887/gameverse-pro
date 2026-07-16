const User = require("../models/User.model");

// Max score PER SECOND of play — rate based, not absolute
const MAX_SCORE_PER_SEC = {
  ludo:     50,
  chess:    20,
  runner:   800,
  survival: 600,
  puzzle:   300
};

// FIX: was checking absolute max (easy to bypass with long sessions)
// Now checks score RATE = score / seconds played
exports.validateGameResult = async (req, res, next) => {
  try {
    const { game, score, duration } = req.body;

    const validGames = ["ludo","chess","runner","survival","puzzle"];
    if (!validGames.includes(game))
      return res.status(400).json({ success: false, message: "Invalid game name." });

    const numScore    = Number(score);
    const numDuration = Number(duration); // seconds

    if (!Number.isFinite(numScore) || numScore < 0)
      return res.status(400).json({ success: false, message: "Invalid score." });

    // FIX: was min 5 sec — too easy to fake. Now min 10 sec
    if (numDuration < 10) {
      await flagUser(req.user._id, "Game ended too fast");
      return res.status(400).json({ success: false, message: "Cheat detected: game too short." });
    }

    const maxRate   = MAX_SCORE_PER_SEC[game] || 100;
    const scoreRate = numScore / numDuration;

    if (scoreRate > maxRate) {
      await flagUser(req.user._id, `Score rate ${scoreRate.toFixed(1)}/s exceeds max ${maxRate}/s`);
      return res.status(400).json({ success: false, message: "Cheat detected: impossible score rate." });
    }

    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

async function flagUser(userId, reason) {
  try {
    console.warn(`[AntiCheat] User ${userId}: ${reason}`);
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { cheatFlags: 1 } },
      { new: true }
    );
    if (user && user.cheatFlags >= 5) {
      await User.findByIdAndUpdate(userId, { isBanned: true });
      console.warn(`[AntiCheat] AUTO-BANNED user ${userId}`);
    }
  } catch (e) { console.error("[AntiCheat DB Error]", e.message); }
}
