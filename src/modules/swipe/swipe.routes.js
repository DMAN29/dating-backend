import express from "express";
import {
  swipeController,
  adminGetAllSwipesController,
  getIncomingLikesController,
} from "./swipe.controller.js";
import { swipeValidation } from "./swipe.validation.js";

const router = express.Router();

router.post("/", swipeValidation, swipeController);
router.get("/incoming", getIncomingLikesController);

const adminSwipeRouter = express.Router();

adminSwipeRouter.get("/", adminGetAllSwipesController);

export default router;
export { adminSwipeRouter };
