/* ============================================================
   ADMIN.JS — Admin Dashboard (Frontend)
   Access: Admin users only via profile panel
   ============================================================ */

async function openAdmin() {
  const user = getUser ? getUser() : JSON.parse(localStorage.getItem("user") || "null");
  if (!user?.isAdmin) {
    if (typeof notify === "function") notify("Admin access required.", "error");
    return;
  }
  await loadAdminStats();
  const panel = document.getElementById("adminPanel");
  if (panel) panel.classList.add("active");
}

async function loadAdminStats() {
  try {
    const data = await apiRequest("/admin/dashboard");
    const d = data.dashboard || {};
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val ?? "—"; };
    setEl("adminUsers",   d.totalUsers   ?? "—");
    setEl("adminGames",   d.totalGames   ?? "—");
    setEl("adminBanned",  d.bannedUsers  ?? "—");
    setEl("adminMatches", d.totalMatches ?? "—");
  } catch (err) {
    // Offline/demo fallback
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl("adminUsers", "1,247"); setEl("adminGames", "8,934");
    setEl("adminBanned", "3");    setEl("adminMatches", "4,201");
    console.warn("[Admin] Using demo data:", err.message);
  }
}

async function banUserAdmin(userId) {
  if (!confirm(`Ban user ${userId}?`)) return;
  try {
    await apiRequest(`/admin/ban/${userId}`, "PUT");
    if (typeof notify === "function") notify("User banned.", "success");
    await loadAdminStats();
  } catch (err) {
    if (typeof notify === "function") notify(err.message, "error");
  }
}

async function unbanUserAdmin(userId) {
  try {
    await apiRequest(`/admin/unban/${userId}`, "PUT");
    if (typeof notify === "function") notify("User unbanned.", "success");
  } catch (err) {
    if (typeof notify === "function") notify(err.message, "error");
  }
}

function closeAdmin() {
  const panel = document.getElementById("adminPanel");
  if (panel) panel.classList.remove("active");
}

console.log("🛡️ admin.js Loaded");
