const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  game: {
    type: String,
    required: true,
    enum: ["ludo", "chess", "runner", "survival", "puzzle", "all"]
  },

  score: {
    type: Number,
    default: 0
  },

  wins: {
    type: Number,
    default: 0
  },

  losses: {
    type: Number,
    default: 0
  },

  gamesPlayed: {
    type: Number,
    default: 0
  },

  coins: {
    type: Number,
    default: 0
  },

  xp: {
    type: Number,
    default: 0
  },

  rank: {
    type: Number,
    default: 0
  },

  period: {
    type: String,
    enum: ["daily", "weekly", "monthly", "alltime"],
    default: "alltime"
  }

},
{
  timestamps: true
});

LeaderboardSchema.index({ game: 1, period: 1, score: -1 });

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
