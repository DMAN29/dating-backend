import express from "express";
import {
  login,
  logout,
  logoutAll,
  refresh,
  signup,
  validateToken,
} from "./auth.controller.js";
import { protect } from "../../shared/middleware/auth.middleware.js";
import { signupValidation, loginValidation } from "./auth.validation.js";

const router = express.Router();

// Public routes
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Protected routes
router.get("/validate", protect, validateToken);
router.post("/logout-all", protect, logoutAll);

export default router;
