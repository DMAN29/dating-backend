import { createClient } from "redis";
import { config } from "./env.js";
import logger from "../shared/utils/logger.js";

const redisClient = createClient({
  url: config.redisUrl || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  logger.error("Redis Client Error:", err);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info("Redis connected");
  }
};

export { redisClient };
