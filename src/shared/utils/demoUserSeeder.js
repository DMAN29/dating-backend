import mongoose from "mongoose";
import User from "../../modules/user/user.model.js";
import { config } from "../../config/env.js";
import logger from "./logger.js";
import {
  USER_ROLES,
  GENDERS,
  SUBSCRIPTION_TYPES,
} from "../constants/user.constants.js";

const createDemoUserData = (index, gender) => {
  const baseEmail = `example${index}@gmail.com`;
  const basePhone = `90000000${index.toString().padStart(2, "0")}`;

  const maleFirstNames = ["Arjun", "Rohit", "Vikram", "Karan", "Rahul"];
  const femaleFirstNames = ["Ananya", "Priya", "Sneha", "Kavya", "Neha"];
  const lastNames = ["Sharma", "Verma", "Patel", "Reddy", "Gupta"];

  const isMale = gender === GENDERS.MALE;
  const firstNames = isMale ? maleFirstNames : femaleFirstNames;

  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];

  const year = 1990 + (index % 10);
  const month = (index % 12) + 1;
  const day = (index % 28) + 1;

  const dateOfBirth = new Date(year, month - 1, day);

  return {
    firstName,
    lastName,
    email: baseEmail,
    password: "password123",
    role: USER_ROLES.USER,
    gender,
    dateOfBirth,
    phoneNumber: basePhone,
    bio: "Demo user for discover and swipe testing.",
    profilePhotos: [
      `https://example.com/photos/${index}-1.jpg`,
      `https://example.com/photos/${index}-2.jpg`,
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
      interestedIn: "both",
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
    },
  };
};

const seedDemoUsers = async () => {
  const totalDemoUsers = 50;
  const existing = await User.countDocuments({
    email: { $regex: "^example[0-9]+@gmail.com$" },
  });

  if (existing >= totalDemoUsers) {
    logger.info("Demo users already seeded. Skipping demo user seeding.");
    return;
  }

  const usersToCreate = [];

  for (let i = 1; i <= totalDemoUsers; i++) {
    const gender = i <= 25 ? GENDERS.MALE : GENDERS.FEMALE;
    const email = `example${i}@gmail.com`;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      continue;
    }
    const userData = createDemoUserData(i, gender);
    usersToCreate.push(userData);
  }

  if (usersToCreate.length === 0) {
    logger.info("No new demo users to create.");
    return;
  }

  await User.insertMany(usersToCreate);
  logger.info(`Seeded ${usersToCreate.length} demo users.`);
};

const runSeed = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB for demo user seeding");

    await seedDemoUsers();
  } catch (error) {
    logger.error(`Demo user seeding failed: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed after demo user seeding");
    process.exit(0);
  }
};

runSeed();

