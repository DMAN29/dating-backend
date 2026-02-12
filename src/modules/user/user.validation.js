import { body } from "express-validator";
import { validate } from "../auth/auth.validation.js";
import {
  GENDERS,
  INTEREST_PREFERENCES,
} from "../../shared/constants/user.constants.js";

/**
 * Profile Update Validation Rules
 */
export const updateProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),
  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty"),
  body("gender")
    .optional()
    .isIn(Object.values(GENDERS))
    .withMessage(`Gender must be one of: ${Object.values(GENDERS).join(", ")}`),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date of birth (YYYY-MM-DD)"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("location.city").optional().trim(),
  body("location.country").optional().trim(),
  body("preference.interestedIn")
    .optional()
    .isIn(Object.values(INTEREST_PREFERENCES))
    .withMessage(
      `Interested in must be one of: ${Object.values(INTEREST_PREFERENCES).join(
        ", ",
      )}`,
    ),
  validate,
];
