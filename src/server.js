import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB } from "./config/database.js";
import { connectRedis } from "./config/redisClient.js";
import logger from "./shared/utils/logger.js";

const start = async () => {
  await connectDB();
  await connectRedis();

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
};

start();
