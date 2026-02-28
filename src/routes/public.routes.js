import express from "express";
import { getPublicConstantsController } from "../modules/public/public.controller.js";

const router = express.Router();

router.get("/constants", getPublicConstantsController);

export default router;
