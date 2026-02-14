import { createClient } from "redis";
import { config } from "../../config/env.js";

const client = createClient({
  url: config.redisUrl || "redis://localhost:6379",
});

client.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Redis Client Error", err);
});

const ensureConnection = async () => {
  if (!client.isReady) {
    await client.connect();
  }
};

export const cacheGet = async (key) => {
  await ensureConnection();
  const value = await client.get(key);
  if (value == null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const cacheSet = async (key, value, ttlMs) => {
  await ensureConnection();
  const payload = typeof value === "string" ? value : JSON.stringify(value);
  const options = ttlMs ? { EX: Math.ceil(ttlMs / 1000) } : undefined;
  await client.set(key, payload, options);
  return true;
};

export const cacheDel = async (key) => {
  await ensureConnection();
  await client.del(key);
  return true;
};

export const cacheReset = async () => {
  await ensureConnection();
  await client.flushDb();
  return true;
};
