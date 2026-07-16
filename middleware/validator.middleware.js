const validator = require("validator");

exports.validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "All fields are required." });
  if (!validator.isEmail(email))
    return res.status(400).json({ success: false, message: "Invalid email address." });
  // FIX: was 6, now 8
  if (!validator.isLength(password, { min: 8 }))
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
  req.body.name  = validator.escape(name.trim());
  req.body.email = validator.normalizeEmail(email);
  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password required." });
  if (!validator.isEmail(email))
    return res.status(400).json({ success: false, message: "Invalid email address." });
  req.body.email = validator.normalizeEmail(email);
  next();
};

exports.validateObjectId = (req, res, next) => {
  if (!validator.isMongoId(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid ID." });
  next();
};
