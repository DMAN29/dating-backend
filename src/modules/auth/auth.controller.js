import {
  registerService,
  loginService,
  refreshService,
  loginWithGoogleService,
  sendOtpService,
  verifyOtpService,
} from "./auth.service.js";
import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";
import { config } from "../../config/env.js";
import ms from "ms";
import logger from "../../shared/utils/logger.js";

export const signupController = async (req, res) => {
  logger.info(`Auth signup attempt for email: ${req.body.email}`);
  try {
    const { user, accessToken, refreshToken } = await registerService(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(config.refreshTokenExpires),
    });

    logger.info(`User registered successfully: ${user.email}`);
    return sendSuccess(res, 201, "User registered successfully", {
      accessToken,
      profile: { isNew: true, isComplete: user.profileComplete },
    });
  } catch (error) {
    logger.error(`Signup failed: ${error.message}`);
    return sendError(res, 400, error.message || "Registration failed");
  }
};

export const loginController = async (req, res) => {
  logger.info(`Auth login attempt for email: ${req.body.email}`);
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginService(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(config.refreshTokenExpires),
    });

    logger.info(`User logged in successfully: ${user.email}`);
    return sendSuccess(res, 200, "Login successful", {
      accessToken,
      profile: { isNew: false, isComplete: user.profileComplete },
    });
  } catch (error) {
    logger.error(`Login failed for email ${req.body.email}: ${error.message}`);
    return sendError(res, 401, error.message || "Login failed");
  }
};

export const logoutController = async (req, res) => {
  logger.info(`User logout: ${req.user?.id}`);
  res.clearCookie("refreshToken");
  return sendSuccess(res, 200, "Logged out successfully");
};

export const logoutAllController = async (req, res) => {
  logger.info(`User logout all sessions: ${req.user?.id}`);
  res.clearCookie("refreshToken");
  return sendSuccess(res, 200, "Logged out from all sessions successfully");
};

export const refreshController = async (req, res) => {
  logger.info("Token refresh attempt");
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      logger.warn("Refresh attempt without token");
      return sendError(res, 400, "Refresh token is required");
    }

    const { accessToken } = await refreshService(refreshToken);

    logger.info("Token refreshed successfully");
    return sendSuccess(res, 200, "Token refreshed successfully", {
      accessToken,
    });
  } catch (error) {
    logger.error(`Token refresh failed: ${error.message}`);
    return sendError(res, 401, error.message || "Token refresh failed");
  }
};

export const validateTokenController = async (req, res) => {
  return sendSuccess(res, 200, "Token is valid", {
    profile: { isComplete: !!req.user?.profileComplete },
  });
};

export const googleLoginController = async (req, res) => {
  try {
    const { idToken } = req.body;
    const { user, accessToken, refreshToken, profile } =
      await loginWithGoogleService(idToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(config.refreshTokenExpires),
    });
    return sendSuccess(res, 200, "Login successful", {
      accessToken,
      profile,
    });
  } catch (error) {
    return sendError(res, 401, error.message || "Google login failed");
  }
};

export const sendOtpController = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const result = await sendOtpService(phoneNumber);
    return sendSuccess(res, 200, "OTP sent", {
      sent: result.sent,
      code: result.code,
    });
  } catch (error) {
    return sendError(res, 400, error.message || "Failed to send OTP");
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const { user, accessToken, refreshToken, profile } = await verifyOtpService(
      phoneNumber,
      otp,
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: ms(config.refreshTokenExpires),
    });
    return sendSuccess(res, 200, "Login successful", {
      accessToken,
      profile,
    });
  } catch (error) {
    return sendError(res, 401, error.message || "OTP verification failed");
  }
};
