import {
  findByEmailWithPassword,
  findById,
  createUser,
  findByGoogleId,
  upsertUserByEmail,
  upsertUserByPhone,
} from "./auth.repository.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../shared/utils/jwt.util.js";

import { OAuth2Client } from "google-auth-library";
import { AUTH_PROVIDERS } from "../../shared/constants/user.constants.js";
import { setOtp, verifyOtp as verifyOtpCode } from "./otp.repository.js";
import { config } from "../../config/env.js";
import logger from "../../shared/utils/logger.js";

const googleClient = new OAuth2Client();

/**
 * Common function to build auth response
 */
const buildAuthResponse = (user) => {
  return {
    accessToken: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
    user: {
      id: user._id,
      profileComplete: user.profileComplete,
      isOnboarded: user.isOnboarded,
    },
  };
};

/**
 * Email Signup
 */
export const registerService = async (userData) => {
  logger.info("Service:register");

  const existingUser = await findByEmailWithPassword(userData.email);
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const user = await createUser({
    ...userData,
    authProvider: AUTH_PROVIDERS.EMAIL,
  });

  return buildAuthResponse(user);
};

/**
 * Email Login
 */
export const loginService = async (email, password) => {
  logger.info("Service:login");

  const user = await findByEmailWithPassword(email);
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid email or password");
  }

  return buildAuthResponse(user);
};

/**
 * Refresh Token
 */
export const refreshService = async (token) => {
  logger.info("Service:refresh");

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await findById(decoded.id);
  if (!user) {
    throw new Error("User no longer exists");
  }

  const accessToken = generateAccessToken(user._id);

  return {
    accessToken,
    user: {
      id: user._id,
      profileComplete: user.profileComplete,
      isOnboarded: user.isOnboarded,
    },
  };
};

/**
 * Google Login
 */
export const loginWithGoogleService = async (idToken) => {
  logger.info("Service:loginWithGoogle");

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: config.googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.email || !payload?.sub) {
    throw new Error("Invalid Google token");
  }

  const googleId = payload.sub;
  const email = payload.email.toLowerCase();
  const name = payload.name || "";

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ").trim() || undefined;

  let user = await findByGoogleId(googleId);

  if (!user) {
    user = await upsertUserByEmail(email, {
      email,
      googleId,
      firstName,
      lastName,
      authProvider: AUTH_PROVIDERS.GOOGLE,
    });
  }

  return buildAuthResponse(user);
};

/**
 * Send OTP
 */
export const sendOtpService = async (phoneNumber) => {
  logger.info(`Service:sendOtp phone=${phoneNumber}`);

  const code = String(Math.floor(100000 + Math.random() * 900000));

  await setOtp(phoneNumber, code, 300);

  return {
    sent: true,
    code: config.nodeEnv === "development" ? code : undefined,
  };
};

/**
 * Verify OTP (Phone Login)
 */
export const verifyOtpService = async (phoneNumber, otp) => {
  logger.info(`Service:verifyOtp phone=${phoneNumber}`);

  const ok = await verifyOtpCode(phoneNumber, otp);
  if (!ok) {
    throw new Error("Invalid or expired OTP");
  }

  const user = await upsertUserByPhone(phoneNumber, {
    phoneNumber,
    authProvider: AUTH_PROVIDERS.PHONE,
  });

  return buildAuthResponse(user);
};
