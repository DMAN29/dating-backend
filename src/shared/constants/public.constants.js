// shared/constants/public.constants.js

import * as UserConstants from "./user.constants.js";
import * as MatrimonialConstants from "./matrimonial.constants.js";

/**
 * Constants safe to expose to frontend
 */

export const PUBLIC_CONSTANTS = {
  user: {
    GENDERS: UserConstants.GENDERS,
    INTEREST_PREFERENCES: UserConstants.INTEREST_PREFERENCES,
  },
  matrimonial: {
    PROFILE_FOR: MatrimonialConstants.PROFILE_FOR,
    MOTHER_TONGUES: MatrimonialConstants.MOTHER_TONGUES,
    MARITAL_STATUS: MatrimonialConstants.MARITAL_STATUS,
    PHYSICAL_STATUS: MatrimonialConstants.PHYSICAL_STATUS,
    RELIGIONS: MatrimonialConstants.RELIGIONS,
    CASTES: MatrimonialConstants.CASTES,
    HAS_DOSH: MatrimonialConstants.HAS_DOSH,
    DOSH_TYPES: MatrimonialConstants.DOSH_TYPES,
    EDUCATION_LEVELS: MatrimonialConstants.EDUCATION_LEVELS,
    EMPLOYMENT_TYPES: MatrimonialConstants.EMPLOYMENT_TYPES,
    OCCUPATIONS: MatrimonialConstants.OCCUPATIONS,
    INCOME_CURRENCIES: MatrimonialConstants.INCOME_CURRENCIES,
    ANNUAL_INCOME: MatrimonialConstants.ANNUAL_INCOME,
    FAMILY_STATUS: MatrimonialConstants.FAMILY_STATUS,
    FAMILY_WEALTH: MatrimonialConstants.FAMILY_WEALTH,
  },
};
