import express from "express";
import { discoverController } from "./discover.controller.js";
import { protect } from "../../shared/middleware/auth.middleware.js";
import { discoverValidation } from "./discover.validation.js";

const router = express.Router();

router.get("/", protect, discoverValidation, discoverController);

export default router;
