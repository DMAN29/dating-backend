import * as userRepository from "./user.repository.js";

/**
 * Service for business logic related to Users
 */

export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateProfile = async (userId, updateData) => {
  // Prevent sensitive fields from being updated here if needed
  const user = await userRepository.updateById(userId, updateData);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const createAdmin = async (adminData) => {
  const existingUser = await userRepository.findByEmail(adminData.email);
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const admin = await userRepository.create({
    ...adminData,
    role: "admin",
    status: { ...adminData.status, isVerified: true },
  });

  return admin;
};

export const deleteUser = async (userId) => {
  const user = await userRepository.deleteById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
