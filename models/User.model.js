const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  mobile:   { type: String, unique: true, sparse: true },
  // FIX: select:false so password never accidentally returned in queries
  password: { type: String, minlength: 8, select: false },
  avatar:   { type: String, default: "🎮" },

  coins:       { type: Number, default: 500,  min: 0 },
  gems:        { type: Number, default: 50,   min: 0 },
  xp:          { type: Number, default: 0,    min: 0 },
  level:       { type: Number, default: 1,    min: 1 },
  loginStreak: { type: Number, default: 0,    min: 0 }, // FIX: was missing
  wins:        { type: Number, default: 0 },
  losses:      { type: Number, default: 0 },
  draws:       { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },

  badges:     [{ type: String }],
  cheatFlags: { type: Number, default: 0 },
  isBanned:   { type: Boolean, default: false },
  isAdmin:    { type: Boolean, default: false },
  lastLogin:  { type: Date, default: Date.now },

  // FIX: game history (last 50) was missing from model
  history: [{
    game:   String,
    score:  Number,
    result: { type: String, enum: ["win","lose","draw"] },
    date:   { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Hash password
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Performance indexes
UserSchema.index({ coins: -1 });
UserSchema.index({ wins:  -1 });

module.exports = mongoose.model("User", UserSchema);
