import mongoose from "mongoose";
import { config } from "./env.js";
import logger from "../shared/utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error("Database connection failed", err.message);
    process.exit(1);
  }
};
