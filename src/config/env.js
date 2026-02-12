import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "1h",
  refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
};
