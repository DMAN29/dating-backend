import express from "express";
import { discoverController } from "./discover.controller.js";
import { discoverValidation } from "./discover.validation.js";

const router = express.Router();

router.get("/", discoverValidation, discoverController);

export default router;
