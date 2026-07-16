/* AntiCheat v3.0 — Fixed false positives on tab/window events */

class AntiCheat {
  constructor() {
    this.startTime   = 0;
    this.cheatFlags  = 0;
    this.maxFlags    = 5;
    this.gameActive  = false;
    this.actionCount = 0;
    this.lastAction  = 0;
    this.tabSwitches = 0;        // FIX: count, don't flag on every switch
    this.TAB_SWITCH_LIMIT = 5;  // only flag after 5 switches
  }

  startGame() {
    this.startTime   = Date.now();
    this.cheatFlags  = 0;
    this.actionCount = 0;
    this.lastAction  = Date.now();
    this.tabSwitches = 0;
    this.gameActive  = true;
  }

  endGame() { this.gameActive = false; }

  flag(reason) {
    this.cheatFlags++;
    console.warn("⚠ Flag:", reason, `(${this.cheatFlags}/${this.maxFlags})`);
    if (this.cheatFlags >= this.maxFlags) this.report(reason);
    return false;
  }

  validateScore(score)      { return score >= 0 && score <= 999999 || this.flag("Invalid score"); }
  validateTime(minSec = 10) { return (Date.now()-this.startTime)/1000 >= minSec || this.flag("Too fast"); }

  validateSpeed(actions, seconds) {
    return (actions / Math.max(seconds, 1)) <= 30 || this.flag("Abnormal speed");
  }

  recordAction() {
    const now = Date.now();
    if (now - this.lastAction < 10) this.flag("Rapid input");
    this.lastAction = now;
    this.actionCount++;
  }

  // FIX: don't flag on every tab switch — only after threshold
  detectTabSwitch() {
    document.addEventListener("visibilitychange", () => {
      if (!this.gameActive || !document.hidden) return;
      this.tabSwitches++;
      if (this.tabSwitches > this.TAB_SWITCH_LIMIT) this.flag("Excessive tab switching");
    });
  }

  // FIX: window blur is a normal event (notifications, OS dialogs) — removed as flag
  // detectWindowBlur removed — was causing false positives

  detectDevTools() {
    const t = 160;
    if (window.outerWidth  - window.innerWidth  > t ||
        window.outerHeight - window.innerHeight > t) {
      this.flag("DevTools open");
    }
  }

  async report(reason) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await fetch("/api/game/report", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ reason, flags: this.cheatFlags, actions: this.actionCount, time: new Date().toISOString() })
      });
    } catch (e) { /* silent */ }
  }

  verify(score, actions = 0) {
    return this.validateScore(score) &&
           this.validateTime(10) &&
           this.validateSpeed(actions, (Date.now()-this.startTime)/1000);
  }

  reset() { this.startTime = Date.now(); this.cheatFlags = 0; this.actionCount = 0; this.tabSwitches = 0; }
}

const antiCheat = new AntiCheat();

function startAntiCheat() {
  antiCheat.detectTabSwitch();
  // FIX: check devtools every 30s, not 5s (less aggressive)
  setInterval(() => antiCheat.detectDevTools(), 30000);
}

function startGameSession()       { antiCheat.startGame(); }
function endGameSession()         { antiCheat.endGame(); }
function verifyGameScore(s, a=0)  { return antiCheat.verify(s, a); }
function recordGameAction()       { antiCheat.recordAction(); }

window.addEventListener("load",         () => startAntiCheat());
window.addEventListener("beforeunload", () => antiCheat.endGame());
console.log("🛡️ anti-cheat.js v3.0 Loaded");
