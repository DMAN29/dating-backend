import express from "express";
import { adminUserRouter } from "../modules/user/user.routes.js";
import { adminSwipeRouter } from "../modules/swipe/swipe.routes.js";
import { adminMatchRouter } from "../modules/match/match.routes.js";

const router = express.Router();

router.use("/users", adminUserRouter);
router.use("/swipes", adminSwipeRouter);
router.use("/matches", adminMatchRouter);

export default router;
