const mongoose = require("mongoose");

const GameSessionSchema = new mongoose.Schema(
{
    game: {
        type: String,
        required: true,
        enum: ["ludo", "chess", "runner", "survival", "puzzle"]
    },

    roomId: {
        type: String,
        default: null
    },

    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    score: {
        type: Number,
        default: 0
    },

    coinsEarned: {
        type: Number,
        default: 0
    },

    xpEarned: {
        type: Number,
        default: 0
    },

    duration: {
        type: Number,
        default: 0
    },

    result: {
        type: String,
        enum: ["win", "lose", "draw", "cancelled"],
        default: "draw"
    },

    status: {
        type: String,
        enum: ["waiting", "playing", "completed"],
        default: "waiting"
    },

    startedAt: {
        type: Date,
        default: Date.now
    },

    endedAt: {
        type: Date
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("GameSession", GameSessionSchema);
