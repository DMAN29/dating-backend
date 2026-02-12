import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";

/**
 * Generate Access Token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.accessTokenExpires,
  });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.refreshTokenExpires,
  });
};

/**
 * Verify Token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};
