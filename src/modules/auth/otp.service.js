import { redisClient } from "../../config/redisClient.js";

const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const MAX_ATTEMPTS = 5;

/* =====================================================
   GENERATE OTP
===================================================== */

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* =====================================================
   STORE OTP
===================================================== */

export const storeOTP = async (phoneNumber, otp) => {
  const key = `otp:${phoneNumber}`;

  await redisClient.setEx(
    key,
    OTP_EXPIRY_SECONDS,
    JSON.stringify({
      otp,
      attempts: 0,
    }),
  );
};

/* =====================================================
   VERIFY OTP
===================================================== */

export const verifyStoredOTP = async (phoneNumber, inputOtp) => {
  const key = `otp:${phoneNumber}`;

  const data = await redisClient.get(key);

  if (!data) {
    return { success: false, message: "OTP expired or not found" };
  }

  const parsed = JSON.parse(data);

  if (parsed.attempts >= MAX_ATTEMPTS) {
    await redisClient.del(key);
    return { success: false, message: "Too many attempts. OTP invalidated." };
  }

  if (parsed.otp !== inputOtp) {
    parsed.attempts += 1;

    await redisClient.setEx(key, OTP_EXPIRY_SECONDS, JSON.stringify(parsed));

    return { success: false, message: "Invalid OTP" };
  }

  await redisClient.del(key);

  return { success: true };
};
