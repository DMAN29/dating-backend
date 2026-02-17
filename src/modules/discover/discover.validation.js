import { query } from "express-validator";
import { validate } from "../auth/auth.validation.js";

export const discoverValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  validate,
];
