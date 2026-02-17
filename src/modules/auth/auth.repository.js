import User from "../user/user.model.js";

/**
 * Repository for database operations related to Authentication
 */

export const findByEmailWithPassword = async (email) => {
  return await User.findOne({ email, isDeleted: { $ne: true } }).select(
    "+password",
  );
};

export const findById = async (id) => {
  return await User.findOne({ _id: id, isDeleted: { $ne: true } });
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findByEmail = async (email) => {
  return await User.findOne({ email, isDeleted: { $ne: true } });
};

export const findByPhone = async (phoneNumber) => {
  return await User.findOne({ phoneNumber, isDeleted: { $ne: true } });
};

export const findByGoogleId = async (googleId) => {
  return await User.findOne({ googleId, isDeleted: { $ne: true } });
};

export const upsertUserByEmail = async (email, data) => {
  return await User.findOneAndUpdate({ email }, data, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
};

export const upsertUserByPhone = async (phoneNumber, data) => {
  return await User.findOneAndUpdate({ phoneNumber }, data, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
};
