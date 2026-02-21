import express from "express";
import { adminUserRouter } from "../modules/user/user.routes.js";
import { adminSwipeRouter } from "../modules/swipe/swipe.routes.js";
import { adminMatchRouter } from "../modules/match/match.routes.js";
import { protect, authorize } from "../shared/middleware/auth.middleware.js";

const router = express.Router();

// 🔐 Apply once for all admin routes
router.use(protect);
router.use(authorize("admin"));

router.use("/users", adminUserRouter);
router.use("/swipes", adminSwipeRouter);
router.use("/matches", adminMatchRouter);

export default router;
