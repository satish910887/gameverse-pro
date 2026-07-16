const express = require("express");

const router = express.Router();

const {
    getStats,
    getUsers,
    banUser,
    unbanUser,
    cheatReports
} = require("../controllers/admin.controller");

const {
    protect,
    adminOnly
} = require("../middleware/auth.middleware");

/* ==========================
   Admin Protection
========================== */

router.use(protect);
router.use(adminOnly);

/* ==========================
   Dashboard Stats
========================== */

router.get(
    "/stats",
    getStats
);

/* ==========================
   Users
========================== */

router.get(
    "/users",
    getUsers
);

/* ==========================
   Ban User
========================== */

router.post(
    "/ban",
    banUser
);

/* ==========================
   Unban User
========================== */

router.post(
    "/unban",
    unbanUser
);

/* ==========================
   Cheat Reports
========================== */

router.get(
    "/cheats",
    cheatReports
);

/* ==========================
   Export
========================== */

module.exports = router;
