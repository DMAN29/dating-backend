import {
  // registerService,
  // loginService,
  refreshService,
  loginWithGoogleService,
  sendOtpService,
  verifyOtpService,
  authWithEmailService,
} from "./auth.service.js";

import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";

import { config } from "../../config/env.js";
import ms from "ms";
import logger from "../../shared/utils/logger.js";

// /**
//  * Email Signup / login
//  */
export const emailAuthController = async (req, res) => {
  logger.info(`Auth email attempt for email: ${req.body.email}`);

  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await authWithEmailService(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(config.refreshTokenExpires),
    });

    return sendSuccess(res, 200, "Authenticated successfully", {
      accessToken,
      user,
    });
  } catch (error) {
    logger.error(`Email auth failed: ${error.message}`);
    return sendError(res, 401, error.message);
  }
};

/**
 * Logout (Single Session)
 */
export const logoutController = async (req, res) => {
  logger.info(`User logout: ${req.user?.id}`);

  res.clearCookie("refreshToken");

  return sendSuccess(res, 200, "Logged out successfully");
};

/**
 * Logout All (Future Enhancement Placeholder)
 */
export const logoutAllController = async (req, res) => {
  logger.info(`User logout all sessions: ${req.user?.id}`);

  res.clearCookie("refreshToken");

  return sendSuccess(res, 200, "Logged out from all sessions successfully");
};

/**
 * Refresh Token
 */
export const refreshController = async (req, res) => {
  logger.info("Token refresh attempt");

  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return sendError(res, 400, "Refresh token is required");
    }

    const { accessToken, user } = await refreshService(refreshToken);

    return sendSuccess(res, 200, "Token refreshed successfully", {
      accessToken,
      user,
    });
  } catch (error) {
    logger.error(`Token refresh failed: ${error.message}`);
    return sendError(res, 401, error.message || "Token refresh failed");
  }
};

/**
 * Validate Token
 */
export const validateTokenController = async (req, res) => {
  return sendSuccess(res, 200, "Token is valid", {
    user: {
      id: req.user._id,
      profileComplete: req.user.profileComplete,
      isOnboarded: req.user.isOnboarded,
    },
  });
};

/**
 * Google Login
 */
export const googleLoginController = async (req, res) => {
  try {
    const { idToken } = req.body;

    const { accessToken, refreshToken, user } =
      await loginWithGoogleService(idToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(config.refreshTokenExpires),
    });

    return sendSuccess(res, 200, "Login successful", {
      accessToken,
      user,
    });
  } catch (error) {
    return sendError(res, 401, error.message || "Google login failed");
  }
};

/**
 * Send OTP
 */
export const sendOtpController = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const result = await sendOtpService(phoneNumber);

    return sendSuccess(res, 200, "OTP sent", result);
  } catch (error) {
    return sendError(res, 400, error.message || "Failed to send OTP");
  }
};

/**
 * Verify OTP (Phone Login)
 */
export const verifyOtpController = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const { accessToken, refreshToken, user } = await verifyOtpService(
      phoneNumber,
      otp,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(config.refreshTokenExpires),
    });

    return sendSuccess(res, 200, "Login successful", {
      accessToken,
      user,
    });
  } catch (error) {
    return sendError(res, 401, error.message || "OTP verification failed");
  }
};
