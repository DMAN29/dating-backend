import * as authService from "./auth.service.js";
import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";
import { config } from "../../config/env.js";
import ms from "ms";
import logger from "../../shared/utils/logger.js";

/**
 * Controller for handling Authentication requests
 */

export const signup = async (req, res) => {
  logger.info(`Auth signup attempt for email: ${req.body.email}`);
  try {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: ms(config.accessTokenExpires),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(config.refreshTokenExpires),
    });

    logger.info(`User registered successfully: ${user.email}`);
    return sendSuccess(res, 201, "User registered successfully", {
      user,
      accessToken,
      // refreshToken,
    });
  } catch (error) {
    logger.error(`Signup failed: ${error.message}`);
    return sendError(res, 400, error.message || "Registration failed");
  }
};

export const login = async (req, res) => {
  logger.info(`Auth login attempt for email: ${req.body.email}`);
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: ms(config.accessTokenExpires),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(config.refreshTokenExpires),
    });

    logger.info(`User logged in successfully: ${user.email}`);
    return sendSuccess(res, 200, "Login successful", {
      user,
      accessToken,
      // refreshToken,
    });
  } catch (error) {
    logger.error(`Login failed for email ${req.body.email}: ${error.message}`);
    return sendError(res, 401, error.message || "Login failed");
  }
};

export const logout = async (req, res) => {
  logger.info(`User logout: ${req.user?.id}`);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return sendSuccess(res, 200, "Logged out successfully");
};

export const logoutAll = async (req, res) => {
  logger.info(`User logout all sessions: ${req.user?.id}`);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return sendSuccess(res, 200, "Logged out from all sessions successfully");
};

export const refresh = async (req, res) => {
  logger.info("Token refresh attempt");
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      logger.warn("Refresh attempt without token");
      return sendError(res, 400, "Refresh token is required");
    }

    const { accessToken } = await authService.refresh(refreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: ms(config.accessTokenExpires),
    });

    logger.info("Token refreshed successfully");
    return sendSuccess(res, 200, "Token refreshed successfully", {
      accessToken,
    });
  } catch (error) {
    logger.error(`Token refresh failed: ${error.message}`);
    return sendError(res, 401, error.message || "Token refresh failed");
  }
};

export const validateToken = async (req, res) => {
  return sendSuccess(res, 200, "Token is valid", { user: req.user });
};
