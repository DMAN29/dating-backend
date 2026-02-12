import { body, validationResult } from "express-validator";
import { sendError } from "../../shared/utils/responseFormatter.js";
import { GENDERS } from "../../shared/constants/user.constants.js";

/**
 * Generic middleware to handle validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return sendError(res, 400, "Validation failed", errorMessages);
  }
  next();
};

/**
 * Signup Validation Rules
 */
export const signupValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("gender")
    .isIn(Object.values(GENDERS))
    .withMessage(`Gender must be one of: ${Object.values(GENDERS).join(", ")}`),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Please provide a valid date of birth (YYYY-MM-DD)"),
  validate,
];

/**
 * Login Validation Rules
 */
export const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];
