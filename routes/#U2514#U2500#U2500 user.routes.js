const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const GameSession = require("../models/GameSession.model");
const User = require("../models/User.model");

/* ==========================
   Get Profile
========================== */

router.get("/profile", protect, async (req, res) => {

    try {

        const user = await User.findById(req.user._id)
            .select("-password");

        res.json({
            success: true,
            user
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

/* ==========================
   Update Profile
========================== */

router.put("/profile", protect, async (req, res) => {

    try {

        const { username, avatar } = req.body;

        const user = await User.findById(req.user._id);

        if (username) user.username = username;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.json({
            success: true,
            user
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

/* ==========================
   Sync User
========================== */

router.post("/sync", protect, async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            coins: user.coins,
            xp: user.xp,
            level: user.level,
            highestScore: user.highestScore
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

/* ==========================
   Match History
========================== */

router.get("/history", protect, async (req, res) => {

    try {

        const history = await GameSession.find({
            user: req.user._id
        })
        .sort({ createdAt: -1 })
        .limit(50);

        res.json({
            success: true,
            history
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

/* ==========================
   Export
========================== */

module.exports = router;
