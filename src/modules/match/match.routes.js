import express from "express";
import {
  getMyMatchesController,
  unmatchController,
  adminGetAllMatchesController,
  blockUserController,
  unblockUserController,
  adminGetBlockedMatchesController,
} from "./match.controller.js";
import { unmatchValidation } from "./match.validation.js";

const router = express.Router();

router.get("/", getMyMatchesController);

router.delete("/:matchId", unmatchValidation, unmatchController);

router.patch("/:matchId/block", blockUserController);

router.patch("/:matchId/unblock", unblockUserController);

const adminMatchRouter = express.Router();

adminMatchRouter.get("/", adminGetAllMatchesController);

adminMatchRouter.get("/blocked", adminGetBlockedMatchesController);

export default router;
export { adminMatchRouter };
