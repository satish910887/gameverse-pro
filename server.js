require("dotenv").config();

const express      = require("express");
const http         = require("http");
const path         = require("path");
const cors         = require("cors");
const helmet       = require("helmet");
const rateLimit    = require("express-rate-limit");
const { Server }   = require("socket.io");

const connectDB    = require("./config/db");
const errorHandler = require("./middleware/error.middleware");

const app    = express();
const server = http.createServer(app);
app.set('trust proxy', 1);
const io     = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5000", methods: ["GET","POST"] },
  pingTimeout: 60000
});

// ── DATABASE ──
connectDB();

// ── SECURITY HEADERS (Helmet with CSP enabled) ──
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrc:    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      fontSrc:     ["'self'", "https://fonts.gstatic.com"],
      imgSrc:      ["'self'", "data:", "blob:"],
      connectSrc:  ["'self'", "wss:", "ws:"],
      frameSrc:    ["'self'"],
    }
  },
  crossOriginEmbedderPolicy: false
}));

// ── CORS ──
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5000",
  credentials: true
}));

// ── BODY PARSER (with size limit to prevent DoS) ──
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── GLOBAL RATE LIMITER ──
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." }
});
app.use("/api", globalLimiter);

// ── AUTH RATE LIMITER (stricter) ──
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: "Too many login attempts. Try again in 15 minutes." }
});

// ── ROUTES ──
app.use("/api/auth",        authLimiter, require("./routes/auth.routes"));
app.use("/api/user",                     require("./routes/user.routes"));
app.use("/api/game",                     require("./routes/game.routes"));
app.use("/api/leaderboard",              require("./routes/leaderboard.routes"));
app.use("/api/admin",                    require("./routes/admin.routes"));

// ── HEALTH CHECK ──
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "GameVerse Pro API Running", uptime: process.uptime(), time: new Date() });
});

// ── FRONTEND STATIC ──
app.use(express.static(path.join(__dirname, "frontend")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ── SOCKET.IO ──
require("./sockets/lobby.socket")(io);
require("./sockets/ludo.socket")(io);
require("./sockets/chess.socket")(io);

// ── GLOBAL ERROR HANDLER (must be last) ──
app.use(errorHandler);

// ── START ──
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("==================================");
  console.log("🎮 GameVerse Pro Started");
  console.log(`🚀 Port : ${PORT}`);
  console.log(`🌍 Mode : ${process.env.NODE_ENV || "development"}`);
  console.log("==================================");
});

module.exports = { app, io };
