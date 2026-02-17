import { body } from "express-validator";
import { validate } from "../auth/auth.validation.js";

export const swipeValidation = [
  body("targetUserId")
    .notEmpty()
    .withMessage("Target user ID is required")
    .isMongoId()
    .withMessage("Invalid target user ID"),

  body("action")
    .notEmpty()
    .withMessage("Action is required")
    .isIn(["accept", "reject"])
    .withMessage("Action must be either accept or reject"),

  validate,
];
