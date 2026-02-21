import {
  findById as findUserById,
  findByEmail as findUserByEmail,
  findByEmailWithPassword as findUserByEmailWithPassword,
  findByPhone as findUserByPhone,
  findByGoogleId as findUserByGoogleId,
  upsertByEmail as upsertUserByEmailRepo,
  upsertByPhone as upsertUserByPhoneRepo,
  create as createUserRepo,
} from "../user/user.repository.js";

/**
 * Repository for database operations related to Authentication
 */

export const findByEmailWithPassword = async (email) => {
  return await findUserByEmailWithPassword(email);
};

export const findById = async (id) => {
  return await findUserById(id);
};

export const createUser = async (userData) => {
  const data = {
    ...userData,
    email: userData.email?.toLowerCase(),
  };
  return await createUserRepo(data);
};

export const findByEmail = async (email) => {
  return await findUserByEmail(email);
};

export const findByPhone = async (phoneNumber) => {
  return await findUserByPhone(phoneNumber);
};

export const findByGoogleId = async (googleId) => {
  return await findUserByGoogleId(googleId);
};

export const upsertUserByEmail = async (email, data) => {
  return await upsertUserByEmailRepo(email, data);
};

export const upsertUserByPhone = async (phoneNumber, data) => {
  return await upsertUserByPhoneRepo(phoneNumber, data);
};
