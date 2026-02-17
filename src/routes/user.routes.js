import express from "express";
import userRoutes from "../modules/user/user.routes.js";
import swipeRoutes from "../modules/swipe/swipe.routes.js";
import matchRoutes from "../modules/match/match.routes.js";
import discoverRoutes from "../modules/discover/discover.routes.js";
import { protect } from "../shared/middleware/auth.middleware.js";

const router = express.Router();

// Apply auth middleware for all user routes
router.use(protect);

// User APIs
router.use("/profile", userRoutes);
router.use("/swipes", swipeRoutes);
router.use("/matches", matchRoutes);
router.use("/discover", discoverRoutes);

export default router;
