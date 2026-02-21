import express from "express";
import userRoutes from "../modules/user/user.routes.js";
import swipeRoutes from "../modules/swipe/swipe.routes.js";
import matchRoutes from "../modules/match/match.routes.js";
import discoverRoutes from "../modules/discover/discover.routes.js";

import { protect } from "../shared/middleware/auth.middleware.js";
import { requireOnboarding } from "../shared/middleware/onboarding.middleware.js";

const router = express.Router();

// 🔐 All routes require authentication
router.use(protect);

// ✅ Profile routes (no onboarding required)
router.use("/profile", userRoutes);

// 🚫 Require onboarding for core app features
router.use("/swipes", requireOnboarding, swipeRoutes);
router.use("/matches", requireOnboarding, matchRoutes);
router.use("/discover", requireOnboarding, discoverRoutes);

export default router;
