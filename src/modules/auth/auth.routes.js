import express from "express";
import {
  // loginController,
  logoutController,
  logoutAllController,
  refreshController,
  // signupController,
  validateTokenController,
  googleLoginController,
  sendOtpController,
  verifyOtpController,
  emailAuthController,
} from "./auth.controller.js";
import { protect } from "../../shared/middleware/auth.middleware.js";
import {
  // signupValidation,
  loginValidation,
  googleLoginValidation,
  sendOtpValidation,
  verifyOtpValidation,
} from "./auth.validation.js";

const router = express.Router();

// router.post("/signup", signupValidation, signupController);

// router.post("/login", loginValidation, loginController);

router.post("/email", loginValidation, emailAuthController);

router.post("/refresh", refreshController);

router.post("/logout", protect, logoutController);

router.get("/validate", protect, validateTokenController);

router.post("/logout-all", protect, logoutAllController);

router.post("/google", googleLoginValidation, googleLoginController);

router.post("/send-otp", sendOtpValidation, sendOtpController);

router.post("/verify-otp", verifyOtpValidation, verifyOtpController);

export default router;
