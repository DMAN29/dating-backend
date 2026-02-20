import express from "express";
import {
  swipeController,
  adminGetAllSwipesController,
  getIncomingLikesController,
} from "./swipe.controller.js";
import { swipeValidation } from "./swipe.validation.js";
import { protect, authorize } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, swipeValidation, swipeController);
router.get("/incoming", protect, getIncomingLikesController);

const adminSwipeRouter = express.Router();

adminSwipeRouter.get(
  "/",
  protect,
  authorize("admin"),
  adminGetAllSwipesController,
);

export default router;
export { adminSwipeRouter };
