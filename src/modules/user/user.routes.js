import express from "express";
import {
  getProfileController,
  updateProfileController,
  getAllUsersController,
  deleteUserController,
  disableUserController,
  getUserByIdController,
} from "./user.controller.js";
import { updateProfileValidation } from "./user.validation.js";

const userRouter = express.Router();

userRouter.get("/", getProfileController);

userRouter.put("/", updateProfileValidation, updateProfileController);

const adminUserRouter = express.Router();

adminUserRouter.get("/", getAllUsersController);

adminUserRouter.get("/:id", getUserByIdController);

adminUserRouter.patch("/:id", disableUserController);

adminUserRouter.delete("/:id", deleteUserController);

export default userRouter;
export { adminUserRouter };
