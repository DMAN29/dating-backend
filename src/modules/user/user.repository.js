import User from "./user.model.js";
import {
  USER_ROLES,
  ACCOUNT_STATUS,
} from "../../shared/constants/user.constants.js";
import { paginate } from "../../shared/utils/pagination.js";

/**
 * Repository for database operations related to Users
 */

export const findById = async (id) => {
  return await User.findOne({ _id: id, isDeleted: { $ne: true } });
};

export const findByEmail = async (email) => {
  return await User.findOne({ email, isDeleted: { $ne: true } });
};

export const findByEmailWithPassword = async (email) => {
  return await User.findOne({
    email: email.toLowerCase(),
    isDeleted: { $ne: true },
  }).select("+password");
};

export const findActiveById = async (id) => {
  return await User.findOne({
    _id: id,
    isDeleted: { $ne: true },
    "status.state": ACCOUNT_STATUS.ACTIVE,
    "status.isBlocked": { $ne: true },
  });
};

export const create = async (userData) => {
  return await User.create(userData);
};

/**
 * IMPORTANT:
 * Use save() instead of findByIdAndUpdate
 * So pre("save") middleware runs
 */
export const updateById = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) return null;

  Object.assign(user, updateData);

  await user.save(); // triggers pre("save")

  return user;
};

export const deleteById = async (id) => {
  const user = await User.findById(id);
  if (!user) return null;

  if (user.role === USER_ROLES.ADMIN) {
    throw new Error("Admin cannot be deleted");
  }

  const timestamp = Date.now();

  user.isDeleted = true;
  user.status.isBlocked = true;
  user.status.state = ACCOUNT_STATUS.INACTIVE;

  if (user.email) {
    user.email = `deleted_${timestamp}_${user.email}`;
  }

  if (user.phoneNumber) {
    user.phoneNumber = `deleted_${timestamp}_${user.phoneNumber}`;
  }

  await user.save();

  return user;
};

export const findDiscoverUsersPaginated = async (filter, page, limit) =>
  paginate({
    model: User,
    filter,
    projection:
      "firstName lastName profilePhotos bio gender dateOfBirth location",
    page,
    limit,
  });

export const findByPhone = async (phoneNumber) => {
  return await User.findOne({
    phoneNumber,
    isDeleted: { $ne: true },
  });
};

export const findByGoogleId = async (googleId) => {
  return await User.findOne({
    googleId,
    isDeleted: { $ne: true },
  });
};

export const upsertByEmail = async (email, data) => {
  let user = await User.findOne({
    email: email.toLowerCase(),
    isDeleted: { $ne: true },
  });

  if (user) {
    Object.assign(user, data);
    await user.save();
    return user;
  }

  user = await User.create({
    ...data,
    email: email.toLowerCase(),
  });

  return user;
};

export const upsertByPhone = async (phoneNumber, data) => {
  let user = await User.findOne({
    phoneNumber,
    isDeleted: { $ne: true },
  });

  if (user) {
    Object.assign(user, data);
    await user.save();
    return user;
  }

  user = await User.create({
    ...data,
    phoneNumber,
  });

  return user;
};

export const findAllPaginated = async (page = 1, limit = 10, filters = {}) => {
  const {
    search,
    gender,
    state,
    isBlocked,
    subscriptionType,
    minAge,
    maxAge,
    city,
  } = filters || {};

  const filter = { isDeleted: { $ne: true }, role: USER_ROLES.USER };

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
  }

  if (gender) {
    filter.gender = gender;
  }

  if (state) {
    filter["status.state"] = state;
  }

  if (typeof isBlocked !== "undefined") {
    const blockedBool =
      typeof isBlocked === "string" ? isBlocked === "true" : !!isBlocked;
    filter["status.isBlocked"] = blockedBool;
  }

  if (subscriptionType) {
    filter["status.subscriptionType"] = subscriptionType;
  }

  if (city) {
    filter["location.city"] = new RegExp(city, "i");
  }

  const now = new Date();
  const dobFilter = {};

  if (minAge) {
    const dobMax = new Date(now);
    dobMax.setFullYear(dobMax.getFullYear() - Number(minAge));
    dobFilter.$lte = dobMax;
  }

  if (maxAge) {
    const dobMin = new Date(now);
    dobMin.setFullYear(dobMin.getFullYear() - Number(maxAge));
    dobFilter.$gte = dobMin;
  }

  if (Object.keys(dobFilter).length > 0) {
    filter.dateOfBirth = dobFilter;
  }

  return paginate({
    model: User,
    filter,
    projection:
      "firstName lastName email gender dateOfBirth phoneNumber role status location preference",
    page,
    limit,
  });
};

export const setBlockedById = async (id, isBlocked) => {
  const user = await User.findById(id);
  if (!user) return null;

  user.status.isBlocked = isBlocked;
  await user.save();

  return user;
};
