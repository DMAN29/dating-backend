import express from "express";
import {
  getProfileController,
  updateProfileController,
  getAllUsersController,
  deleteUserController,
  disableUserController,
  getUserByIdController,
} from "./user.controller.js";
import { protect, authorize } from "../../shared/middleware/auth.middleware.js";
import { updateProfileValidation } from "./user.validation.js";

const userRouter = express.Router();

userRouter.get("/", protect, getProfileController);

userRouter.put("/", protect, updateProfileValidation, updateProfileController);

const adminUserRouter = express.Router();

adminUserRouter.get("/", protect, authorize("admin"), getAllUsersController);

adminUserRouter.get("/:id", protect, authorize("admin"), getUserByIdController);

adminUserRouter.patch(
  "/:id",
  protect,
  authorize("admin"),
  disableUserController,
);

adminUserRouter.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUserController,
);

export default userRouter;
export { adminUserRouter };
