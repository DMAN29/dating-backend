import express from "express";
import { adminUserRouter } from "../modules/user/user.routes.js";
import { protect, authorize } from "../shared/middleware/auth.middleware.js";

const router = express.Router();

// Admin middleware
router.use(protect);
router.use(authorize("admin"));

router.use("/users", adminUserRouter);

export default router;
