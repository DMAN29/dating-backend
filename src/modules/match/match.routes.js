import express from "express";
import {
  getMyMatchesController,
  unmatchController,
} from "./match.controller.js";
import { protect } from "../../shared/middleware/auth.middleware.js";
import { unmatchValidation } from "./match.validation.js";

const router = express.Router();

/**
 * GET /api/matches
 * Get all matches of logged-in user
 */
router.get("/", protect, getMyMatchesController);

/**
 * DELETE /api/matches/:matchId
 * Unmatch a user
 */
router.delete("/:matchId", protect, unmatchValidation, unmatchController);

export default router;
