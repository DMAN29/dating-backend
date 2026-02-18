import express from "express";
import {
  getMyMatchesController,
  unmatchController,
  adminGetAllMatchesController,
} from "./match.controller.js";
import { protect, authorize } from "../../shared/middleware/auth.middleware.js";
import { unmatchValidation } from "./match.validation.js";

const router = express.Router();

router.get("/", protect, getMyMatchesController);

router.delete("/:matchId", protect, unmatchValidation, unmatchController);

const adminMatchRouter = express.Router();

adminMatchRouter.get(
  "/",
  protect,
  authorize("admin"),
  adminGetAllMatchesController,
);

export default router;
export { adminMatchRouter };
