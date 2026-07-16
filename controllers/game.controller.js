const GameSession = require("../models/GameSession.model");
const User        = require("../models/User.model");
const Leaderboard = require("../models/Leaderboard.model");

const COIN_REWARDS = { win: 100, draw: 20, lose: 5 };
const XP_REWARDS   = { win: 50,  draw: 10, lose: 0  };

// ── START GAME ──
exports.startGame = async (req, res) => {
  try {
    const { game, roomId } = req.body;
    const validGames = ["ludo","chess","runner","survival","puzzle"];
    if (!game || !validGames.includes(game))
      return res.status(400).json({ success: false, message: "Valid game type required." });

    const session = await GameSession.create({
      game, roomId: roomId || null,
      players:  [req.user._id],
      status:   "playing",
      startedAt: new Date()
    });
    res.status(201).json({ success: true, message: "Game Started", session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── END GAME ──
exports.endGame = async (req, res) => {
  try {
    const { sessionId, score, result, duration } = req.body;

    if (!sessionId)
      return res.status(400).json({ success: false, message: "Session ID required." });

    const session = await GameSession.findById(sessionId);
    if (!session)
      return res.status(404).json({ success: false, message: "Session not found." });

    // Prevent double-ending
    if (session.status === "completed")
      return res.status(400).json({ success: false, message: "Session already completed." });

    const validResult = ["win","lose","draw"].includes(result) ? result : "draw";
    session.score    = Number(score)    || 0;
    session.result   = validResult;
    session.duration = Number(duration) || 0;
    session.status   = "completed";
    session.endedAt  = new Date();
    session.winner   = validResult === "win" ? req.user._id : null;
    await session.save();

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    user.gamesPlayed++;
    if (validResult === "win")  { user.wins++;   user.coins += COIN_REWARDS.win;  user.xp += XP_REWARDS.win;  }
    if (validResult === "lose") { user.losses++;  user.coins += COIN_REWARDS.lose; }
    if (validResult === "draw") { user.draws++;   user.coins += COIN_REWARDS.draw; user.xp += XP_REWARDS.draw; }

    // Level up
    while (user.xp >= user.level * 1000) { user.xp -= user.level * 1000; user.level++; }

    // FIX: Add to history (was missing)
    if (!user.history) user.history = [];
    user.history.push({ game: session.game, score: session.score, result: validResult });
    if (user.history.length > 50) user.history = user.history.slice(-50);

    await user.save();

    // Update leaderboard for all periods
    for (const period of ["alltime","daily","weekly","monthly"]) {
      let lb = await Leaderboard.findOne({ user: user._id, game: session.game, period });
      if (!lb) lb = new Leaderboard({ user: user._id, game: session.game, period });
      lb.gamesPlayed++;
      lb.score += Number(score || 0);
      lb.coins  = user.coins;
      lb.xp     = user.xp;
      if (validResult === "win")  lb.wins++;
      if (validResult === "lose") lb.losses++;
      await lb.save();
    }

    res.json({
      success: true, message: "Game Completed",
      rewards: { coins: COIN_REWARDS[validResult] || 0, xp: XP_REWARDS[validResult] || 0 },
      session
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── HISTORY ──
exports.history = async (req, res) => {
  try {
    const history = await GameSession.find({ players: req.user._id })
      .sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, count: history.length, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
