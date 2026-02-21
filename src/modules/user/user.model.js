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

const userSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC PROFILE
    ========================= */

    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

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
      minlength: [5, "Password must be at least 5 characters"],
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
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },

    profilePhotos: [{ type: String }],

    /* =========================
       LOCATION
    ========================= */

    location: {
      city: { type: String },
      country: { type: String },
      coordinates: {
        type: {
          type: String,
          enum: Object.values(GEO_TYPES),
          default: GEO_TYPES.POINT,
        },
        coordinates: {
          type: [Number],
          default: [0, 0], // [0,0] means not set
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
       COMPLETION FLAGS
    ========================= */

    profileComplete: {
      type: Boolean,
      default: false,
    },

    isOnboarded: {
      type: Boolean,
      default: false,
    },

    /* =========================
       ACCOUNT STATUS
    ========================= */

    status: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
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

    isDeleted: {
      type: Boolean,
      default: false,
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
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
  return await bcrypt.compare(candidatePassword, this.password);
};

/* =========================
   PROFILE COMPLETION CHECK
========================= */

userSchema.methods.checkProfileComplete = function () {
  return Boolean(
    this.firstName && this.lastName && this.gender && this.dateOfBirth,
  );
};

/* =========================
   FULL ONBOARDING CHECK
========================= */

userSchema.methods.checkOnboardingComplete = function () {
  const hasBasics = this.checkProfileComplete();

  const hasBio = Boolean(this.bio?.trim());

  const hasPhotos =
    Array.isArray(this.profilePhotos) && this.profilePhotos.length > 0;

  const coords = this.location?.coordinates?.coordinates;

  const hasValidCoordinates =
    Array.isArray(coords) &&
    coords.length === 2 &&
    !(coords[0] === 0 && coords[1] === 0);

  // 🔥 Dynamic contact requirement
  const hasContactInfo =
    this.authProvider === AUTH_PROVIDERS.PHONE
      ? Boolean(this.phoneNumber)
      : Boolean(this.email);

  return (
    hasBasics && hasBio && hasPhotos && hasValidCoordinates && hasContactInfo
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
