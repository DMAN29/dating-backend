import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../modules/user/user.model.js";
import { config } from "../../config/env.js";
import logger from "./logger.js";
import {
  USER_ROLES,
  GENDERS,
  SUBSCRIPTION_TYPES,
} from "../constants/user.constants.js";

const INTEREST_OPTIONS = [GENDERS.MALE, GENDERS.FEMALE, "both"];

const createDemoUserData = async (index, gender) => {
  const baseEmail = `testuser${index}@gmail.com`;
  const basePhone = `90000000${index.toString().padStart(2, "0")}`;

  const maleFirstNames = ["Arjun", "Rohit", "Vikram", "Karan", "Rahul"];
  const femaleFirstNames = ["Ananya", "Priya", "Sneha", "Kavya", "Neha"];
  const lastNames = ["Sharma", "Verma", "Patel", "Reddy", "Gupta"];

  const isMale = gender === GENDERS.MALE;
  const firstNames = isMale ? maleFirstNames : femaleFirstNames;

  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];

  const year = 1990 + (index % 8);
  const month = (index % 12) + 1;
  const day = (index % 28) + 1;

  const dateOfBirth = new Date(year, month - 1, day);

  // ✅ Hash password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ✅ Random interestedIn
  const randomInterest =
    INTEREST_OPTIONS[Math.floor(Math.random() * INTEREST_OPTIONS.length)];

  return {
    firstName,
    lastName,
    email: baseEmail,
    password: hashedPassword,
    role: USER_ROLES.USER,
    gender,
    dateOfBirth,
    phoneNumber: basePhone,
    bio: "Demo user for discover and swipe testing.",
    profilePhotos: [
      `https://randomuser.me/api/portraits/${isMale ? "men" : "women"}/${index % 99}.jpg`,
    ],
    location: {
      city: "Bangalore",
      country: "India",
      coordinates: {
        type: "Point",
        coordinates: [77.5946, 12.9716],
      },
    },
    preference: {
      interestedIn: randomInterest,
      ageRange: {
        min: 21,
        max: 35,
      },
      maxDistance: 50,
    },
    status: {
      isVerified: true,
      isBlocked: false,
      subscriptionType: SUBSCRIPTION_TYPES.FREE,
      state: "active",
    },
    profileComplete: true,
    isDeleted: false,
  };
};

const seedDemoUsers = async () => {
  const totalUsers = 50;

  const existing = await User.countDocuments({
    email: { $regex: "^testuser[0-9]+@gmail.com$" },
  });

  if (existing >= totalUsers) {
    logger.info("Demo users already seeded.");
    return;
  }

  const usersToCreate = [];

  for (let i = 1; i <= totalUsers; i++) {
    const gender = i <= 25 ? GENDERS.MALE : GENDERS.FEMALE;

    const existingUser = await User.findOne({
      email: `testuser${i}@gmail.com`,
    });

    if (existingUser) continue;

    const userData = await createDemoUserData(i, gender);
    usersToCreate.push(userData);
  }

  if (!usersToCreate.length) {
    logger.info("No new demo users to insert.");
    return;
  }

  await User.insertMany(usersToCreate);
  logger.info(`✅ Seeded ${usersToCreate.length} demo users successfully.`);
};

const runSeed = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB");

    await seedDemoUsers();
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

runSeed();
