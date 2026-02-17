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

export const create = async (userData) => {
  return await User.create(userData);
};

export const updateById = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    return null;
  }
  if (user.role === USER_ROLES.ADMIN) {
    throw new Error("Admin cannot be deleted");
  }
  const timestamp = Date.now();
  const updateData = {
    isDeleted: true,
    "status.isBlocked": true,
    "status.state": ACCOUNT_STATUS.INACTIVE,
  };
  if (user.email) {
    updateData.email = `deleted_${timestamp}_${user.email}`;
  }
  if (user.phoneNumber) {
    updateData.phoneNumber = `deleted_${timestamp}_${user.phoneNumber}`;
  }
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const findAllPaginated = async (page = 1, limit = 10) => {
  const filter = { isDeleted: { $ne: true }, role: USER_ROLES.USER };
  return paginate({
    model: User,
    filter,
    projection:
      "firstName lastName email gender dateOfBirth phoneNumber role status",
    page,
    limit,
  });
};

export const setBlockedById = async (id, isBlocked) => {
  return await User.findByIdAndUpdate(
    id,
    { "status.isBlocked": isBlocked },
    { new: true },
  );
};
