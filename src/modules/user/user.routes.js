import express from "express";
import {
  getProfileController,
  updateProfileController,
  addAdminController,
  deleteAdminController,
} from "./user.controller.js";
import { protect, authorize } from "../../shared/middleware/auth.middleware.js";
import { updateProfileValidation } from "./user.validation.js";
import { signupValidation } from "../auth/auth.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and management endpoints
 */

// All user routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", getProfileController);

/**
 * @swagger
 * /api/users/update:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               bio:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch("/update", updateProfileValidation, updateProfileController);

/**
 * @swagger
 * /api/users/add-admin:
 *   post:
 *     summary: Add a new admin (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       403:
 *         description: Forbidden - Requires admin role
 */
router.post(
  "/add-admin",
  authorize("admin"),
  signupValidation,
  addAdminController,
);

/**
 * @swagger
 * /api/users/admin/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Forbidden
 */
router.delete("/admin/:id", authorize("admin"), deleteAdminController);

export default router;
