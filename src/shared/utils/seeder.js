import mongoose from "mongoose";
import User from "../../modules/user/user.model.js";
import { config } from "../../config/env.js";
import logger from "./logger.js";
import {
  USER_ROLES,
  GENDERS,
  SUBSCRIPTION_TYPES,
} from "../constants/user.constants.js";

/**
 * Admin Seeder Script
 * Run with: npm run seed:admin
 */
const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB for seeding");

    const adminEmail = "admin@dating.com";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      logger.info(
        `Admin with email ${adminEmail} already exists. Skipping seeder.`,
      );
    } else {
      // Create admin user
      const adminData = {
        firstName: "System",
        lastName: "Admin",
        email: adminEmail,
        password: "admin", // Will be hashed by pre-save hook
        role: USER_ROLES.ADMIN,
        gender: GENDERS.OTHER,
        dateOfBirth: new Date("1990-01-01"),
        status: {
          isVerified: true,
          isBlocked: false,
          subscriptionType: SUBSCRIPTION_TYPES.PREMIUM,
        },
      };

      await User.create(adminData);
      logger.info("Admin user seeded successfully!");
    }
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
  } finally {
    // Close connection
    await mongoose.connection.close();
    logger.info("MongoDB connection closed after seeding");
    process.exit(0);
  }
};

seedAdmin();
