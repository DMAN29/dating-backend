import express from "express";
import {
  getProfileController,
  updateProfileController,
  getAllUsersController,
  deleteUserController,
  disableUserController,
  getUserByIdController,
} from "./user.controller.js";
import { protect, authorize } from "../../shared/middleware/auth.middleware.js";
import { updateProfileValidation } from "./user.validation.js";
import { signupValidation } from "../auth/auth.validation.js";

const router = express.Router();

router.get("/", protect, getProfileController);

router.put("/", protect, updateProfileValidation, updateProfileController);

router.get("/admin", protect, authorize("admin"), getAllUsersController);

router.get("/admin/:id", protect, authorize("admin"), getUserByIdController);

router.patch("/admin/:id", protect, authorize("admin"), disableUserController);

router.delete("/admin/:id", protect, authorize("admin"), deleteUserController);

export default router;
