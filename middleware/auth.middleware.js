const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// Protect Routes
exports.protect = async (req, res, next) => {
  try {

    let token = null;

    // Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Token Missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing."
      });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find User
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found."
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned."
      });
    }

    req.user = user;

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });

  }
};

// Admin Only
exports.adminOnly = (req, res, next) => {

  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin access required."
    });
  }

  next();

};
