import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  mongoUri: process.env.MONGO_URI,

  // Auth
  jwtSecret: process.env.JWT_SECRET,
  accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "7d",
  refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "30d",
  googleClientId: process.env.GOOGLE_CLIENT_ID,

  // URLs
  baseUrl: process.env.BASE_URL || "http://localhost:5000",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",

  // Cache
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
};
