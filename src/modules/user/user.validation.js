import { body } from "express-validator";
import { validate } from "../auth/auth.validation.js";
import {
  GENDERS,
  INTEREST_PREFERENCES,
  AUTH_PROVIDERS,
} from "../../shared/constants/user.constants.js";

export const updateProfileValidation = [
  /**
   * 🔐 Email Update Rule
   */
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value, { req }) => {
      const provider = req.user.authProvider;

      if (
        provider === AUTH_PROVIDERS.EMAIL ||
        provider === AUTH_PROVIDERS.GOOGLE
      ) {
        throw new Error(
          "Email cannot be updated for email or google based accounts",
        );
      }

      return true;
    }),

  /**
   * 🔐 Phone Update Rule
   */
  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .custom((value, { req }) => {
      const provider = req.user.authProvider;

      if (provider === AUTH_PROVIDERS.PHONE) {
        throw new Error(
          "Phone number cannot be updated for phone-based accounts",
        );
      }

      return true;
    }),

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
    .withMessage("Please provide a valid date (YYYY-MM-DD)"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

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
