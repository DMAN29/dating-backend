import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import swipeRoutes from "../modules/swipe/swipe.routes.js";
import matchRoutes from "../modules/match/match.routes.js";
import discoverRoutes from "../modules/discover/discover.routes.js";

const router = express.Router();

/**
 * Main router file that combines all individual module routes
 */

// Auth module routes
router.use("/auth", authRoutes);

// User module routes
router.use("/users", userRoutes);

// Swipe module routes
router.use("/swipes", swipeRoutes);

// Match module routes
router.use("/matches", matchRoutes);

// Discover module routes
router.use("/discover", discoverRoutes);

export default router;
