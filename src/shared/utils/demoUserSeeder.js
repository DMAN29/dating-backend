// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import User from "../../modules/user/user.model.js";
// import { config } from "../../config/env.js";
// import logger from "./logger.js";
// import {
//   USER_ROLES,
//   GENDERS,
//   SUBSCRIPTION_TYPES,
//   INTEREST_PREFERENCES,
//   ACCOUNT_STATUS,
// } from "../constants/user.constants.js";

// const INTEREST_OPTIONS = [
//   INTEREST_PREFERENCES.MALE,
//   INTEREST_PREFERENCES.FEMALE,
//   INTEREST_PREFERENCES.BOTH,
// ];

// // 📍 Base location (Bangalore)
// const BASE_LNG = 77.5946;
// const BASE_LAT = 12.9716;

// // Generate random nearby coordinates (~5-8km radius)
// const getRandomCoordinates = () => {
//   const offset = () => (Math.random() - 0.5) * 0.15;
//   return [BASE_LNG + offset(), BASE_LAT + offset()];
// };

// const createDemoUserData = async (index, gender) => {
//   const baseEmail = `testuser${index}@gmail.com`;
//   const basePhone = `80000000${index.toString().padStart(2, "0")}`;

//   const maleFirstNames = ["Arjun", "Rohit", "Vikram", "Karan", "Rahul"];
//   const femaleFirstNames = ["Ananya", "Priya", "Sneha", "Kavya", "Neha"];
//   const lastNames = ["Sharma", "Verma", "Patel", "Reddy", "Gupta"];

//   const isMale = gender === GENDERS.MALE;
//   const firstNames = isMale ? maleFirstNames : femaleFirstNames;

//   const firstName = firstNames[index % firstNames.length];
//   const lastName = lastNames[index % lastNames.length];

//   // 🎂 Age spread 22 - 32
//   const year = 1992 + (index % 10);
//   const month = index % 12;
//   const day = (index % 28) + 1;
//   const dateOfBirth = new Date(year, month, day);

//   // 🔐 Hash password once (insertMany won't rehash)
//   const hashedPassword = await bcrypt.hash("password123", 10);

//   const randomInterest =
//     INTEREST_OPTIONS[Math.floor(Math.random() * INTEREST_OPTIONS.length)];

//   const coordinates = getRandomCoordinates();

//   return {
//     firstName,
//     lastName,
//     email: baseEmail,
//     password: hashedPassword,
//     phoneNumber: basePhone,
//     role: USER_ROLES.USER,
//     gender,
//     dateOfBirth,
//     bio: "Hey! I'm here to explore and meet interesting people 😊",
//     profilePhotos: [
//       `https://randomuser.me/api/portraits/${
//         isMale ? "men" : "women"
//       }/${index % 90}.jpg`,
//     ],
//     location: {
//       city: "Bangalore",
//       country: "India",
//       coordinates: {
//         type: "Point",
//         coordinates,
//       },
//     },
//     preference: {
//       interestedIn: randomInterest,
//       ageRange: {
//         min: 21,
//         max: 35,
//       },
//       maxDistance: 50,
//     },
//     status: {
//       isVerified: true,
//       isBlocked: false,
//       subscriptionType:
//         index % 10 === 0 ? SUBSCRIPTION_TYPES.PREMIUM : SUBSCRIPTION_TYPES.FREE,
//       state: ACCOUNT_STATUS.ACTIVE,
//     },
//     profileComplete: true,
//     isOnboarded: true,
//     isDeleted: false,
//     lastActive: new Date(),
//   };
// };

// const seedDemoUsers = async () => {
//   const totalUsers = 50;

//   const existing = await User.countDocuments({
//     email: { $regex: "^testuser[0-9]+@gmail.com$" },
//   });

//   if (existing >= totalUsers) {
//     logger.info("Demo users already seeded.");
//     return;
//   }

//   const usersToCreate = [];

//   for (let i = 1; i <= totalUsers; i++) {
//     const gender = i <= 25 ? GENDERS.MALE : GENDERS.FEMALE;

//     const exists = await User.findOne({
//       email: `testuser${i}@gmail.com`,
//     });

//     if (exists) continue;

//     const userData = await createDemoUserData(i, gender);
//     usersToCreate.push(userData);
//   }

//   if (!usersToCreate.length) {
//     logger.info("No new demo users to insert.");
//     return;
//   }

//   await User.insertMany(usersToCreate);

//   logger.info(`✅ Seeded ${usersToCreate.length} demo users successfully.`);
// };

// const runSeed = async () => {
//   try {
//     await mongoose.connect(config.mongoUri);
//     logger.info("Connected to MongoDB");

//     await seedDemoUsers();
//   } catch (error) {
//     logger.error(`Seeding failed: ${error.message}`);
//   } finally {
//     await mongoose.connection.close();
//     process.exit(0);
//   }
// };

// runSeed();

import mongoose from "mongoose";
import User from "../../modules/user/user.model.js";
import { config } from "../../config/env.js";
import logger from "./logger.js";

const updateProfilePhotos = async () => {
  try {
    const result = await User.updateMany(
      // {
      // email: {
      //   $regex: "^(testuser|example)[0-9]+@gmail.com$",

      // },
      // },
      {
        email: { $regex: "^[a-zA-Z]+[0-9]+@gmail.com$" },
      },
      {
        $set: {
          profilePhotos: ["https://thispersondoesnotexist.com"],
        },
      },
    );

    logger.info(
      `✅ Updated profile photos for ${result.modifiedCount} users successfully.`,
    );
  } catch (error) {
    logger.error(`❌ Update failed: ${error.message}`);
  }
};

const runUpdate = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB");

    await updateProfilePhotos();
  } catch (error) {
    logger.error(`Script failed: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

runUpdate();
