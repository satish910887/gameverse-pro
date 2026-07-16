const User = require("../models/User.model");
const GameSession = require("../models/GameSession.model");
const Leaderboard = require("../models/Leaderboard.model");

// Dashboard Stats
exports.getDashboard = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalGames = await GameSession.countDocuments();

        const bannedUsers = await User.countDocuments({
            isBanned: true
        });

        const totalMatches = await GameSession.countDocuments({
            status: "completed"
        });

        res.json({
            success: true,
            dashboard: {
                totalUsers,
                totalGames,
                totalMatches,
                bannedUsers
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Get All Users
exports.getUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({
                createdAt: -1
            });

        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Ban User
exports.banUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isBanned = true;

        await user.save();

        res.json({
            success: true,
            message: "User banned successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Unban User
exports.unbanUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isBanned = false;

        await user.save();

        res.json({
            success: true,
            message: "User unbanned successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Delete User
exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Leaderboard
exports.getLeaderboard = async (req, res) => {

    try {

        const leaderboard = await Leaderboard
            .find()
            .populate("user", "name level")
            .sort({
                score: -1
            })
            .limit(100);

        res.json({
            success: true,
            count: leaderboard.length,
            leaderboard
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
