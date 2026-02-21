import User from "../user/user.model.js";

/**
 * Repository for database operations related to Authentication
 */

/**
 * Find user by email (with password field included)
 */
export const findByEmailWithPassword = async (email) => {
  return await User.findOne({
    email: email.toLowerCase(),
    isDeleted: { $ne: true },
  }).select("+password");
};

/**
 * Find user by ID
 */
export const findById = async (id) => {
  return await User.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
};

/**
 * Create new user
 */
export const createUser = async (userData) => {
  return await User.create({
    ...userData,
    email: userData.email?.toLowerCase(),
  });
};

/**
 * Find by email (without password)
 */
export const findByEmail = async (email) => {
  return await User.findOne({
    email: email.toLowerCase(),
    isDeleted: { $ne: true },
  });
};

/**
 * Find by phone
 */
export const findByPhone = async (phoneNumber) => {
  return await User.findOne({
    phoneNumber,
    isDeleted: { $ne: true },
  });
};

/**
 * Find by Google ID
 */
export const findByGoogleId = async (googleId) => {
  return await User.findOne({
    googleId,
    isDeleted: { $ne: true },
  });
};

/**
 * Upsert user by email (Google signup)
 */
export const upsertUserByEmail = async (email, data) => {
  let user = await User.findOne({
    email: email.toLowerCase(),
    isDeleted: { $ne: true },
  });

  if (user) {
    Object.assign(user, data);
    await user.save(); // triggers pre("save")
    return user;
  }

  user = await User.create({
    ...data,
    email: email.toLowerCase(),
  });

  return user;
};
/**
 * Upsert user by phone (OTP login)
 */
export const upsertUserByPhone = async (phoneNumber, data) => {
  let user = await User.findOne({
    phoneNumber,
    isDeleted: { $ne: true },
  });

  if (user) {
    Object.assign(user, data);
    await user.save(); // triggers pre("save")
    return user;
  }

  user = await User.create({
    ...data,
    phoneNumber,
  });

  return user;
};
