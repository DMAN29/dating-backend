import express from "express";
import {
  getProfile,
  updateProfile,
  addAdmin,
  deleteAdmin,
} from "./user.controller.js";
import { protect, authorize } from "../../shared/middleware/auth.middleware.js";
import { updateProfileValidation } from "./user.validation.js";
import { signupValidation } from "../auth/auth.validation.js";

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Standard user routes
router.get("/profile", getProfile);
router.patch("/update", updateProfileValidation, updateProfile);

// Admin only routes
router.post("/add-admin", authorize("admin"), signupValidation, addAdmin);
router.delete("/admin/:id", authorize("admin"), deleteAdmin);

export default router;
