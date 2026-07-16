const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

/* ==========================
   Protect Route
========================== */

exports.protect = async (req, res, next) => {

try {

let token;

if (

req.headers.authorization &&

req.headers.authorization.startsWith("Bearer")

) {

token = req.headers.authorization.split(" ")[1];

}

if (!token) {

return res.status(401).json({

success: false,

message: "Access denied. No token provided."

});

}

const decoded = jwt.verify(

token,

process.env.JWT_SECRET

);

const user = await User.findById(decoded.id)

.select("-password");

if (!user) {

return res.status(401).json({

success: false,

message: "User not found"

});

}

if (user.isBanned) {

return res.status(403).json({

success: false,

message: "Your account has been banned"

});

}

req.user = user;

next();

} catch (err) {

return res.status(401).json({

success: false,

message: "Invalid or expired token"

});

}

};

/* ==========================
   Admin Only
========================== */

exports.adminOnly = (req, res, next) => {

if (!req.user) {

return res.status(401).json({

success: false,

message: "Unauthorized"

});

}

if (!req.user.isAdmin) {

return res.status(403).json({

success: false,

message: "Admin access required"

});

}

next();

};

/* ==========================
   Optional Auth
========================== */

exports.optionalAuth = async (req, res, next) => {

try {

let token;

if (

req.headers.authorization &&

req.headers.authorization.startsWith("Bearer")

) {

token = req.headers.authorization.split(" ")[1];

}

if (!token) {

return next();

}

const decoded = jwt.verify(

token,

process.env.JWT_SECRET

);

const user = await User.findById(decoded.id)

.select("-password");

if (user) {

req.user = user;

}

next();

} catch (err) {

next();

}

};
