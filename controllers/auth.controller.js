const jwt       = require("jsonwebtoken");
const validator = require("validator");
const User      = require("../models/User.model");
const OTP       = require("../models/OTP.model");

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

// ── REGISTER ──
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required." });

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: "Invalid email address." });

    // FIX: was min 6, now min 8
    if (!validator.isLength(password, { min: 8 }))
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });

    if (!validator.isLength(name, { min: 2, max: 50 }))
      return res.status(400).json({ success: false, message: "Name must be 2–50 characters." });

    // Sanitize
    email = validator.normalizeEmail(email);
    name  = validator.escape(name.trim());

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ success: false, message: "Email already registered." });

    const user  = await User.create({ name, email, password });
    user.password = undefined;
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration failed." });
  }
};

// ── LOGIN ──
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required." });

    // FIX: always fetch user (timing-safe — don't leak "email not found")
    const user = await User.findOne({ email: validator.normalizeEmail(email) }).select("+password");

    // Always run comparePassword to prevent timing attacks
    const isMatch = user ? await user.comparePassword(password) : false;

    if (!user || !isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    if (user.isBanned)
      return res.status(403).json({ success: false, message: "Your account has been banned." });

    // Streak logic
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (user.lastLogin?.toDateString() === yesterday) {
      user.loginStreak = (user.loginStreak || 0) + 1;
      if (user.loginStreak >= 7) user.coins += 500;
      else                        user.coins += 50;
    } else if (user.lastLogin?.toDateString() !== today) {
      user.loginStreak = 1;
    }
    user.lastLogin = new Date();
    await user.save();

    user.password = undefined;
    const token = generateToken(user._id);

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed." });
  }
};

// ── ME ──
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── LOGOUT ──
exports.logout = async (req, res) => {
  // JWT is stateless — client deletes token. Optional: add to blocklist via Redis
  res.json({ success: true, message: "Logged out successfully." });
};

// ── SEND OTP ──
exports.sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || !validator.isMobilePhone(mobile, "any"))
      return res.status(400).json({ success: false, message: "Valid mobile number required." });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await OTP.findOneAndUpdate(
      { mobile },
      { mobile, otp, expiresAt, verified: false, attempts: 0 },
      { upsert: true, new: true }
    );

    // TODO: integrate Twilio/MSG91 here
    // await twilioClient.messages.create({ to: mobile, from: process.env.TWILIO_FROM, body: `GameVerse OTP: ${otp}` });

    console.log(`[DEV] OTP for ${mobile}: ${otp}`); // Remove in production
    res.json({ success: true, message: "OTP sent successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

// ── VERIFY OTP ──
exports.verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp)
      return res.status(400).json({ success: false, message: "Mobile and OTP required." });

    const record = await OTP.findOne({ mobile, verified: false });
    if (!record || record.expiresAt < new Date())
      return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });

    // Max 5 attempts
    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(429).json({ success: false, message: "Too many attempts. Request a new OTP." });
    }

    if (record.otp !== otp) {
      record.attempts++;
      await record.save();
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    await OTP.deleteOne({ _id: record._id });

    let user = await User.findOne({ mobile });
    if (!user) user = await User.create({ mobile, name: `Player${Date.now().toString(36)}` });

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "OTP verification failed." });
  }
};
