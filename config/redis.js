/* config/redis.js — Redis with in-memory fallback */
const memCache = new Map();
const fallback = {
  get: async (k)       => { const v = memCache.get(k); return v ?? null; },
  set: async (k, v, o) => { if (o?.EX) setTimeout(() => memCache.delete(k), o.EX * 1000); memCache.set(k, v); },
  del: async (k)       => memCache.delete(k),
};

let client = null;

async function getRedis() {
  if (!process.env.REDIS_URL) return fallback;
  if (client) return client;
  try {
    const { createClient } = require("redis");
    client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (e) => { console.warn("Redis error:", e.message); client = null; });
    await client.connect();
    console.log("✅ Redis connected");
    return client;
  } catch {
    console.warn("⚠️  Redis unavailable — using memory cache");
    return fallback;
  }
}

module.exports = { getRedis };
