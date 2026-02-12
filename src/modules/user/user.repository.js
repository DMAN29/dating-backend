import User from "./user.model.js";

/**
 * Repository for database operations related to Users
 */

export const findById = async (id) => {
  return await User.findById(id);
};

export const findByEmail = async (email) => {
  return await User.findOne({ email });
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
  return await User.findByIdAndDelete(id);
};
