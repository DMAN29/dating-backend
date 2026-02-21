import express from "express";
import {
  getMyMatchesController,
  unmatchController,
  adminGetAllMatchesController,
} from "./match.controller.js";
import { unmatchValidation } from "./match.validation.js";

const router = express.Router();

router.get("/", getMyMatchesController);

router.delete("/:matchId", unmatchValidation, unmatchController);

const adminMatchRouter = express.Router();

adminMatchRouter.get("/", adminGetAllMatchesController);

export default router;
export { adminMatchRouter };
