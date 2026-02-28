import {
  findByEmailWithPassword,
  findById,
  createUser,
  findByGoogleId,
  upsertUserByEmail,
  upsertUserByPhone,
  findByEmail,
  findByPhone,
} from "./auth.repository.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../shared/utils/jwt.util.js";

import { OAuth2Client } from "google-auth-library";
import { AUTH_PROVIDERS } from "../../shared/constants/user.constants.js";
import { generateOTP, storeOTP, verifyStoredOTP } from "./otp.service.js";
import { config } from "../../config/env.js";
import logger from "../../shared/utils/logger.js";

const googleClient = new OAuth2Client();

/* =====================================================
   COMMON AUTH RESPONSE
===================================================== */

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

/* =====================================================
   EMAIL LOGIN
===================================================== */

export const authWithEmailService = async (email, password) => {
  logger.info("Service:authWithEmail");

  email = email.toLowerCase();

  let user = await findByEmailWithPassword(email);

  if (user) {
    if (user.authProvider !== AUTH_PROVIDERS.EMAIL) {
      throw new Error(`Please login using ${user.authProvider}`);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    return buildAuthResponse(user);
  }

  user = await createUser({
    email,
    password,
    authProvider: AUTH_PROVIDERS.EMAIL,
    isOnboarded: false,
    profileComplete: false,
  });

  return buildAuthResponse(user);
};

/* =====================================================
   REFRESH TOKEN
===================================================== */

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

/* =====================================================
   GOOGLE LOGIN
===================================================== */

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

  let user = await findByGoogleId(googleId);

  if (!user) {
    user = await findByEmail(email);

    if (user) {
      user.googleId = googleId;
      await user.save();
    } else {
      user = await upsertUserByEmail(email, {
        email,
        googleId,
        authProvider: AUTH_PROVIDERS.GOOGLE,
        isOnboarded: false,
        profileComplete: false,
      });
    }
  }

  return buildAuthResponse(user);
};

/* =====================================================
   SEND OTP (PLAYSTORE SIMPLE VERSION)
===================================================== */

export const sendOtpService = async (phoneNumber) => {
  logger.info(`Service:sendOtp phone=${phoneNumber}`);

  let otp;

  if (phoneNumber === "9999999999") {
    otp = "999999"; // Play Store review login
  } else {
    otp = generateOTP();
  }

  await storeOTP(phoneNumber, otp);

  return {
    sent: true,
    code: config.nodeEnv === "development" ? otp : undefined,
  };
};

/* =====================================================
   VERIFY OTP
===================================================== */

export const verifyOtpService = async (phoneNumber, otp) => {
  logger.info(`Service:verifyOtp phone=${phoneNumber}`);

  const result = await verifyStoredOTP(phoneNumber, otp);

  if (!result.success) {
    throw new Error(result.message);
  }

  let user = await findByPhone(phoneNumber);

  if (!user) {
    user = await upsertUserByPhone(phoneNumber, {
      phoneNumber,
      authProvider: AUTH_PROVIDERS.PHONE,
      isOnboarded: false,
      profileComplete: false,
    });
  }

  return buildAuthResponse(user);
};
