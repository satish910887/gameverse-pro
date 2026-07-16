const User = require("../models/User.model");

/* ==========================
   Game Limits
========================== */

const GAME_LIMITS = {
    ludo: 5000,
    chess: 10000,
    puzzle: 50000,
    runner: 100000,
    survival: 100000
};

/* ==========================
   Anti Cheat Middleware
========================== */

exports.validateScore = async (req, res, next) => {

    try {

        const { game, score } = req.body;

        if (!game || typeof score !== "number") {

            return res.status(400).json({
                success: false,
                message: "Invalid score data"
            });

        }

        const maxScore = GAME_LIMITS[game];

        if (!maxScore) {

            return res.status(400).json({
                success: false,
                message: "Unknown game"
            });

        }

        if (score > maxScore) {

            await addCheatFlag(req.user._id);

            return res.status(403).json({
                success: false,
                message: "Cheating detected"
            });

        }

        next();

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/* ==========================
   Add Cheat Flag
========================== */

async function addCheatFlag(userId) {

    const user = await User.findById(userId);

    if (!user) return;

    user.cheatFlags += 1;

    if (user.cheatFlags >= 5) {

        user.isBanned = true;

    }

    await user.save();

}

/* ==========================
   Reset Cheat Flags
========================== */

exports.resetCheatFlags = async (userId) => {

    const user = await User.findById(userId);

    if (!user) return;

    user.cheatFlags = 0;

    await user.save();

};

/* ==========================
   Get Cheat Status
========================== */

exports.getCheatStatus = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)
            .select("cheatFlags isBanned");

        res.json({
            success: true,
            cheatFlags: user.cheatFlags,
            isBanned: user.isBanned
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
