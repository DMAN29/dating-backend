import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";

const router = express.Router();

/**
 * Main router file that combines all individual module routes
 */

// Auth module routes
router.use("/auth", authRoutes);

// User module routes
router.use("/users", userRoutes);

// Other modules will be added here:
// router.use("/matches", matchRoutes);

export default router;
