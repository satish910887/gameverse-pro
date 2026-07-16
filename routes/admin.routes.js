const router = require("express").Router();
const admin  = require("../controllers/admin.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const { validateObjectId }   = require("../middleware/validator.middleware");

router.get("/dashboard", protect, adminOnly, admin.getDashboard);
router.get("/users",     protect, adminOnly, admin.getUsers);
// FIX: added validateObjectId to prevent MongoDB injection via bad :id
router.put("/ban/:id",   protect, adminOnly, validateObjectId, admin.banUser);
router.put("/unban/:id", protect, adminOnly, validateObjectId, admin.unbanUser);
router.delete("/delete/:id", protect, adminOnly, validateObjectId, admin.deleteUser);
router.get("/leaderboard",   protect, adminOnly, admin.getLeaderboard);

module.exports = router;
