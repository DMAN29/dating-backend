import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  USER_ROLES,
  GENDERS,
  INTEREST_PREFERENCES,
  SUBSCRIPTION_TYPES,
  GEO_TYPES,
  AUTH_PROVIDERS,
} from "../../shared/constants/user.constants.js";

const userSchema = new mongoose.Schema(
  {
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
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phoneNumber: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
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
    profilePhotos: [
      {
        type: String,
      },
    ],
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
          default: [0, 0],
        },
      },
    },
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
    authProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.EMAIL,
    },
    googleId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
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

// Indexes
userSchema.index({ "location.coordinates": "2dsphere" });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.checkProfileComplete = function () {
  const requiredFields = [
    this.firstName,
    this.lastName,
    this.gender,
    this.dateOfBirth,
  ];
  return requiredFields.every((v) => !!v);
};

userSchema.pre("save", function (next) {
  this.profileComplete = this.checkProfileComplete();
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
