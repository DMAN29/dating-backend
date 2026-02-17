import express from "express";
import { swipeController } from "./swipe.controller.js";
import { swipeValidation } from "./swipe.validation.js";
import { protect } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/swipes
 * Body:
 * {
 *   targetUserId: string,
 *   action: "accept" | "reject"
 * }
 */
router.post("/", protect, swipeValidation, swipeController);

export default router;
