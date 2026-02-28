// import { body } from "express-validator";
// import { validate } from "../auth/auth.validation.js";
// import {
//   GENDERS,
//   INTEREST_PREFERENCES,
//   AUTH_PROVIDERS,
// } from "../../shared/constants/user.constants.js";

// export const updateProfileValidation = [
//   /**
//    * 🔐 Email Update Rule
//    */
//   body("email")
//     .optional()
//     .isEmail()
//     .withMessage("Invalid email format")
//     .custom((value, { req }) => {
//       const provider = req.user.authProvider;

//       if (
//         provider === AUTH_PROVIDERS.EMAIL ||
//         provider === AUTH_PROVIDERS.GOOGLE
//       ) {
//         throw new Error(
//           "Email cannot be updated for email or google based accounts",
//         );
//       }

//       return true;
//     }),

//   /**
//    * 🔐 Phone Update Rule
//    */
//   body("phoneNumber")
//     .optional()
//     .isMobilePhone()
//     .withMessage("Invalid phone number")
//     .custom((value, { req }) => {
//       const provider = req.user.authProvider;

//       if (provider === AUTH_PROVIDERS.PHONE) {
//         throw new Error(
//           "Phone number cannot be updated for phone-based accounts",
//         );
//       }

//       return true;
//     }),

//   body("firstName")
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage("First name cannot be empty"),

//   body("lastName")
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage("Last name cannot be empty"),

//   body("gender")
//     .optional()
//     .isIn(Object.values(GENDERS))
//     .withMessage(`Gender must be one of: ${Object.values(GENDERS).join(", ")}`),

//   body("dateOfBirth")
//     .optional()
//     .isISO8601()
//     .withMessage("Please provide a valid date (YYYY-MM-DD)"),

//   body("bio")
//     .optional()
//     .trim()
//     .isLength({ max: 500 })
//     .withMessage("Bio cannot exceed 500 characters"),

//   body("preference.interestedIn")
//     .optional()
//     .isIn(Object.values(INTEREST_PREFERENCES))
//     .withMessage(
//       `Interested in must be one of: ${Object.values(INTEREST_PREFERENCES).join(
//         ", ",
//       )}`,
//     ),

//   validate,
// ];

import { body } from "express-validator";
import { validate } from "../auth/auth.validation.js";

import {
  GENDERS,
  INTEREST_PREFERENCES,
  AUTH_PROVIDERS,
} from "../../shared/constants/user.constants.js";

import {
  PROFILE_FOR,
  MOTHER_TONGUES,
  MARITAL_STATUS,
  PHYSICAL_STATUS,
  RELIGIONS,
  CASTES,
  HAS_DOSH,
  DOSH_TYPES,
  EDUCATION_LEVELS,
  EMPLOYMENT_TYPES,
  OCCUPATIONS,
  INCOME_CURRENCIES,
  ANNUAL_INCOME,
  FAMILY_STATUS,
  FAMILY_WEALTH,
} from "../../shared/constants/matrimonial.constants.js";

/* =====================================================
   UPDATE PROFILE VALIDATION
===================================================== */

export const updateProfileValidation = [
  /* =========================
     AUTH FIELD PROTECTION
  ========================= */

  body("email").optional().isEmail().withMessage("Invalid email format"),

  // .custom((value, { req }) => {
  //   const provider = req.user.authProvider;

  //   if (
  //     provider === AUTH_PROVIDERS.EMAIL ||
  //     provider === AUTH_PROVIDERS.GOOGLE
  //   ) {
  //     throw new Error(
  //       "Email cannot be updated for email or google based accounts",
  //     );
  //   }

  //   return true;
  // })
  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  // .custom((value, { req }) => {
  //   const provider = req.user.authProvider;

  //   if (provider === AUTH_PROVIDERS.PHONE) {
  //     throw new Error(
  //       "Phone number cannot be updated for phone-based accounts",
  //     );
  //   }

  //   return true;
  // })
  /* =========================
     BASIC PROFILE
  ========================= */

  body("firstName").optional().trim().notEmpty(),

  body("lastName").optional().trim().notEmpty(),

  body("gender")
    .optional()
    .isIn(Object.values(GENDERS))
    .withMessage(`Invalid gender`),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (YYYY-MM-DD)"),

  body("bio").optional().trim().isLength({ max: 500 }),

  /* =========================
     MATRIMONIAL
  ========================= */

  body("matrimonial.profileFor").optional().isIn(Object.values(PROFILE_FOR)),

  body("matrimonial.motherTongue")
    .optional()
    .isIn(Object.values(MOTHER_TONGUES)),

  body("matrimonial.personal.maritalStatus")
    .optional()
    .isIn(Object.values(MARITAL_STATUS)),

  body("matrimonial.personal.physicalStatus")
    .optional()
    .isIn(Object.values(PHYSICAL_STATUS)),

  body("matrimonial.religious.religion")
    .optional()
    .isIn(Object.values(RELIGIONS)),

  body("matrimonial.religious.caste").optional().isIn(Object.values(CASTES)),

  body("matrimonial.religious.hasDosh")
    .optional()
    .isIn(Object.values(HAS_DOSH)),

  body("matrimonial.religious.doshType")
    .optional()
    .isIn(Object.values(DOSH_TYPES)),

  body("matrimonial.professional.education")
    .optional()
    .isIn(Object.values(EDUCATION_LEVELS)),

  body("matrimonial.professional.employmentType")
    .optional()
    .isIn(Object.values(EMPLOYMENT_TYPES)),

  body("matrimonial.professional.occupation")
    .optional()
    .isIn(Object.values(OCCUPATIONS)),

  body("matrimonial.professional.incomeCurrency")
    .optional()
    .isIn(Object.values(INCOME_CURRENCIES)),

  body("matrimonial.professional.annualIncome")
    .optional()
    .isIn(Object.values(ANNUAL_INCOME)),

  body("matrimonial.family.familyStatus")
    .optional()
    .isIn(Object.values(FAMILY_STATUS)),

  body("matrimonial.family.familyWealth")
    .optional()
    .isIn(Object.values(FAMILY_WEALTH)),

  /* =========================
     PREFERENCES
  ========================= */

  body("preference.interestedIn")
    .optional()
    .isIn(Object.values(INTEREST_PREFERENCES)),

  validate,
];
