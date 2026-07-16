const Leaderboard = require("../models/Leaderboard.model");

// Get Leaderboard
exports.getLeaderboard = async (req, res) => {

    try {

        const game = req.query.game || "all";
        const period = req.query.period || "alltime";
        const limit = Math.min(Number(req.query.limit) || 50, 100);

        const leaderboard = await Leaderboard
            .find({
                game,
                period
            })
            .populate("user", "name avatar level")
            .sort({
                score: -1,
                wins: -1
            })
            .limit(limit);

        const ranked = leaderboard.map((player, index) => ({
            rank: index + 1,
            ...player.toObject()
        }));

        res.json({
            success: true,
            count: ranked.length,
            leaderboard: ranked
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Player Rank
exports.getMyRank = async (req, res) => {

    try {

        const game = req.query.game || "all";
        const period = req.query.period || "alltime";

        const leaderboard = await Leaderboard
            .find({
                game,
                period
            })
            .sort({
                score: -1,
                wins: -1
            });

        const index = leaderboard.findIndex(
            item => item.user.toString() === req.user._id.toString()
        );

        res.json({
            success: true,
            rank: index >= 0 ? index + 1 : null,
            totalPlayers: leaderboard.length
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Top Players
exports.topPlayers = async (req, res) => {

    try {

        const limit = Math.min(Number(req.query.limit) || 10, 100);

        const top = await Leaderboard
            .find({ period: "alltime" })
            .populate("user", "name avatar level")
            .sort({
                score: -1,
                wins: -1
            })
            .limit(limit);

        res.json({
            success: true,
            count: top.length,
            players: top
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
