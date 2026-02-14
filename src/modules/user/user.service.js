import { findById, updateById, findByEmail, create, deleteById } from "./user.repository.js";
import logger from "../../shared/utils/logger.js";
import { cacheGet, cacheSet, cacheDel } from "../../shared/utils/cache.js";

/**
 * Service for business logic related to Users
 */

export const getProfileService = async (userId) => {
  logger.info(`Service:getProfile userId=${userId}`);
  const cached = await cacheGet(`user:${userId}`);
  if (cached) {
    logger.debug(`Cache hit for user:${userId}`);
    return cached;
  }
  const user = await findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  await cacheSet(`user:${userId}`, user, 60 * 1000);
  return user;
};

export const updateProfileService = async (userId, updateData) => {
  logger.info(`Service:updateProfile userId=${userId}`);
  const user = await updateById(userId, updateData);
  if (!user) {
    throw new Error("User not found");
  }
  await cacheDel(`user:${userId}`);
  return user;
};

export const createAdminService = async (adminData) => {
  logger.info(`Service:createAdmin email=${adminData.email}`);
  const existingUser = await findByEmail(adminData.email);
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const admin = await create({
    ...adminData,
    role: "admin",
    status: { ...adminData.status, isVerified: true },
  });

  return admin;
};

export const deleteUserService = async (userId) => {
  logger.info(`Service:deleteUser userId=${userId}`);
  const user = await deleteById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  await cacheDel(`user:${userId}`);
  return user;
};
