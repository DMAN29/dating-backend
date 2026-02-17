import { param } from "express-validator";
import { validate } from "../auth/auth.validation.js";

export const unmatchValidation = [
  param("matchId")
    .notEmpty()
    .withMessage("Match ID is required")
    .isMongoId()
    .withMessage("Invalid match ID"),
  validate,
];
