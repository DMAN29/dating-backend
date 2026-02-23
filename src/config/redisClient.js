import { createClient } from "redis";
import { config } from "./env.js";
import logger from "../shared/utils/logger.js";

const MAX_RECONNECT_ATTEMPTS = 5;

const redisClient = createClient({
  url: config.redisUrl || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > MAX_RECONNECT_ATTEMPTS) {
        logger.error(
          `Redis reconnect failed after ${MAX_RECONNECT_ATTEMPTS} attempts`,
        );
        return new Error("Redis reconnect attempts exhausted");
      }

      const delay = Math.min(retries * 1000, 5000);
      logger.warn(`Redis reconnect attempt ${retries}, retrying in ${delay}ms`);
      return delay;
    },
  },
});

/* -------------------------
   EVENT LISTENERS
-------------------------- */

redisClient.on("connect", () => {
  logger.info("Redis connecting...");
});

redisClient.on("ready", () => {
  logger.info("Redis ready to use");
});

redisClient.on("error", (err) => {
  logger.error("Redis Client Error:", err);
});

redisClient.on("end", () => {
  logger.warn("Redis connection closed");
});

/* -------------------------
   CONNECT FUNCTION
-------------------------- */

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      logger.info("Redis connected successfully");
    } catch (err) {
      logger.error(`Initial Redis connection failed: ${err.message}`);

      // Optional: crash app if Redis is critical
      if (config.nodeEnv === "production") {
        process.exit(1);
      }
    }
  }
};

/* -------------------------
   GRACEFUL SHUTDOWN
-------------------------- */

process.on("SIGINT", async () => {
  logger.info("Closing Redis connection...");
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit(0);
});

export { redisClient };
