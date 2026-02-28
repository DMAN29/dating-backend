import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import {
  USER_ROLES,
  GENDERS,
  INTEREST_PREFERENCES,
  SUBSCRIPTION_TYPES,
  GEO_TYPES,
  AUTH_PROVIDERS,
  ACCOUNT_STATUS,
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

const userSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC PROFILE
    ========================= */

    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === AUTH_PROVIDERS.EMAIL;
      },
      minlength: 5,
      select: false,
    },

    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    gender: {
      type: String,
      enum: Object.values(GENDERS),
    },

    dateOfBirth: {
      type: Date,
    },

    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    profilePhotos: [{ type: String }],

    /* =========================
       MATRIMONIAL DETAILS
    ========================= */

    matrimonial: {
      profileFor: {
        type: String,
        enum: Object.values(PROFILE_FOR),
      },

      motherTongue: {
        type: String,
        enum: Object.values(MOTHER_TONGUES),
      },

      personal: {
        height: {
          feet: { type: Number },
          inches: { type: Number },
          cm: { type: Number, index: true },
        },

        physicalStatus: {
          type: String,
          enum: Object.values(PHYSICAL_STATUS),
        },

        maritalStatus: {
          type: String,
          enum: Object.values(MARITAL_STATUS),
        },
      },

      religious: {
        religion: {
          type: String,
          enum: Object.values(RELIGIONS),
          index: true,
        },

        caste: {
          type: String,
          enum: Object.values(CASTES),
          index: true,
        },

        subcaste: {
          type: String,
          trim: true,
        },

        willingToMarryAnyCaste: {
          type: Boolean,
          default: false,
        },

        hasDosh: {
          type: String,
          enum: Object.values(HAS_DOSH),
        },

        doshType: {
          type: String,
          enum: Object.values(DOSH_TYPES),
        },
      },

      professional: {
        education: {
          type: String,
          enum: Object.values(EDUCATION_LEVELS),
          index: true,
        },

        employmentType: {
          type: String,
          enum: Object.values(EMPLOYMENT_TYPES),
        },

        occupation: {
          type: String,
          enum: Object.values(OCCUPATIONS),
        },

        incomeCurrency: {
          type: String,
          enum: Object.values(INCOME_CURRENCIES),
        },

        annualIncome: {
          type: String,
          enum: Object.values(ANNUAL_INCOME),
        },
      },

      family: {
        familyStatus: {
          type: String,
          enum: Object.values(FAMILY_STATUS),
        },

        familyWealth: {
          type: String,
          enum: Object.values(FAMILY_WEALTH),
        },

        ancestralOrigin: {
          type: String,
          trim: true,
        },
      },
    },

    /* =========================
       LOCATION
    ========================= */

    location: {
      city: { type: String },
      state: { type: String },
      country: { type: String },

      coordinates: {
        type: {
          type: String,
          enum: Object.values(GEO_TYPES),
          default: GEO_TYPES.POINT,
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },

    /* =========================
       PREFERENCES
    ========================= */

    preference: {
      interestedIn: {
        type: String,
        enum: Object.values(INTEREST_PREFERENCES),
        default: INTEREST_PREFERENCES.BOTH,
      },

      ageRange: {
        min: { type: Number, default: 18 },
        max: { type: Number, default: 100 },
      },

      maxDistance: {
        type: Number,
        default: 50,
      },
    },

    /* =========================
       AUTH & ROLE
    ========================= */

    authProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.EMAIL,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },

    /* =========================
       ACCOUNT STATUS
    ========================= */

    status: {
      isVerified: { type: Boolean, default: false },
      isBlocked: { type: Boolean, default: false },

      subscriptionType: {
        type: String,
        enum: Object.values(SUBSCRIPTION_TYPES),
        default: SUBSCRIPTION_TYPES.FREE,
      },

      state: {
        type: String,
        enum: Object.values(ACCOUNT_STATUS),
        default: ACCOUNT_STATUS.ACTIVE,
      },
    },

    /* =========================
       SYSTEM FLAGS
    ========================= */

    profileComplete: { type: Boolean, default: false },
    isOnboarded: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isDummy: { type: Boolean, default: false, index: true },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

/* =========================
   INDEXES
========================= */

userSchema.index({ "location.coordinates": "2dsphere" });

/* =========================
   PASSWORD HASHING
========================= */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* =========================
   PASSWORD COMPARISON
========================= */

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* =========================
   PROFILE COMPLETION CHECK
========================= */

userSchema.methods.checkProfileComplete = function () {
  return Boolean(
    this.firstName &&
    this.gender &&
    this.dateOfBirth &&
    this.matrimonial?.personal?.height?.cm &&
    this.matrimonial?.religious?.religion &&
    this.matrimonial?.professional?.education,
  );
};

/* =========================
   FULL ONBOARDING CHECK
========================= */

userSchema.methods.checkOnboardingComplete = function () {
  const hasFirstName = this.firstName && this.firstName.trim().length > 0;

  const hasLastName = this.lastName && this.lastName.trim().length > 0;

  const hasGender = !!this.gender;

  const hasPreference = !!this.preference?.interestedIn;

  const coords = this.location?.coordinates?.coordinates;

  const hasValidCoordinates =
    Array.isArray(coords) &&
    coords.length === 2 &&
    !(coords[0] === 0 && coords[1] === 0);

  return (
    hasFirstName &&
    hasLastName &&
    hasGender &&
    hasPreference &&
    hasValidCoordinates
  );
};

/* =========================
   AUTO UPDATE FLAGS
========================= */

userSchema.pre("save", function (next) {
  this.profileComplete = this.checkProfileComplete();
  this.isOnboarded = this.checkOnboardingComplete();
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
