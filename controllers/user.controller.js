const User        = require("../models/User.model");
const GameSession = require("../models/GameSession.model");

const MAX_COINS_PER_ACTION = 500;  // Security: max coins per API call
const MAX_XP_PER_ACTION    = 200;

// ── PROFILE ──
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── UPDATE PROFILE ──
exports.updateProfile = async (req, res) => {
  try {
    const validator = require("validator");
    let { name, avatar } = req.body;

    const allowed = ["🎮","👾","🤖","🧑‍🚀","🦸","🥷","👑","🎭","🐉","⚔️","🛡️","🏆"];
    if (avatar && !allowed.includes(avatar)) avatar = "🎮"; // only allow preset avatars

    const update = {};
    if (name) {
      if (!validator.isLength(name, { min: 2, max: 30 }))
        return res.status(400).json({ success: false, message: "Name must be 2–30 chars." });
      update.name = validator.escape(name.trim());
    }
    if (avatar) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
    res.json({ success: true, message: "Profile updated.", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── STATS ──
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    const recentGames = await GameSession.find({ players: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json({
      success: true,
      stats: {
        coins: user.coins || 0, gems: user.gems || 0, xp: user.xp || 0,
        level: user.level || 1, wins: user.wins || 0, losses: user.losses || 0,
        draws: user.draws || 0, gamesPlayed: user.gamesPlayed || 0,
        badges: user.badges || [], loginStreak: user.loginStreak || 0
      },
      recentGames
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADD COINS (FIX: capped & validated — was unlimited) ──
exports.addCoins = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0 || amount > MAX_COINS_PER_ACTION)
      return res.status(400).json({ success: false, message: `Amount must be 1–${MAX_COINS_PER_ACTION}.` });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { coins: amount } },
      { new: true }
    ).select("coins");
    res.json({ success: true, coins: user.coins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADD XP (FIX: capped) ──
exports.addXP = async (req, res) => {
  try {
    const xp = Number(req.body.xp);
    if (!xp || xp <= 0 || xp > MAX_XP_PER_ACTION)
      return res.status(400).json({ success: false, message: `XP must be 1–${MAX_XP_PER_ACTION}.` });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    user.xp = (user.xp || 0) + xp;
    while (user.xp >= user.level * 1000) { user.xp -= user.level * 1000; user.level++; }
    await user.save();

    res.json({ success: true, xp: user.xp, level: user.level });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
