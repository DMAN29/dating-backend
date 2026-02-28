import {
  findById,
  updateById,
  findByEmail,
  create,
  deleteById,
  findAllPaginated,
} from "./user.repository.js";
import logger from "../../shared/utils/logger.js";
import {
  USER_ROLES,
  ACCOUNT_STATUS,
  AUTH_PROVIDERS,
  GEO_TYPES,
} from "../../shared/constants/user.constants.js";
import { getMissingOnboardingFields } from "../../shared/utils/onboardingChecker.js";

/**
 * Service for business logic related to Users
 */

export const getProfileService = async (userId) => {
  const user = await findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.isOnboarded) {
    return {
      user,
      missingFields: getMissingOnboardingFields(user),
    };
  }

  return { user };
};

export const updateProfileService = async (userId, updateData) => {
  const existingUser = await findById(userId);
  if (!existingUser) throw new Error("User not found");

  const sanitizedData = { ...updateData };

  // ❌ Never allow password update here
  delete sanitizedData.password;

  // ❌ Protect identity field based on provider
  if (existingUser.authProvider === AUTH_PROVIDERS.EMAIL) {
    delete sanitizedData.email;
  }

  if (existingUser.authProvider === AUTH_PROVIDERS.GOOGLE) {
    delete sanitizedData.googleId;
    delete sanitizedData.email; // Google identity tied to email
  }

  if (existingUser.authProvider === AUTH_PROVIDERS.PHONE) {
    delete sanitizedData.phoneNumber;
  }
  if (sanitizedData.location?.coordinates?.coordinates) {
    const coords = sanitizedData.location.coordinates.coordinates;

    sanitizedData.location.coordinates = {
      type: sanitizedData.location.coordinates.type || GEO_TYPES.POINT,
      coordinates: coords,
    };
  }
  // ❌ Never allow system fields
  delete sanitizedData.role;
  delete sanitizedData.status;
  delete sanitizedData.authProvider;
  delete sanitizedData.profileComplete;
  delete sanitizedData.isOnboarded;
  delete sanitizedData.isDeleted;
  delete sanitizedData.isDummy;
  delete sanitizedData.lastActive;

  const updatedUser = await updateById(userId, sanitizedData);
  if (!updatedUser) throw new Error("User not found");

  if (!updatedUser.isOnboarded) {
    return {
      user: updatedUser,
      missingFields: getMissingOnboardingFields(updatedUser),
    };
  }

  return { user: updatedUser };
};

export const getUserByIdService = async (userId) => {
  logger.info(`Service:getUserById userId=${userId}`);
  const user = await findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

export const createAdminService = async (adminData) => {
  logger.info("Service:createAdmin called via API");
  throw new Error("Admin user cannot be created via API. Use seeder only.");
};

export const deleteUserService = async (userId) => {
  logger.info(`Service:deleteUser userId=${userId}`);
  const user = await deleteById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.role === USER_ROLES.ADMIN) {
    throw new Error("Admin cannot be deleted");
  }
  return user;
};

export const getAllUsersService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    gender,
    state,
    isBlocked,
    subscriptionType,
    minAge,
    maxAge,
    city,
  } = query;

  logger.info(
    `Service:getAllUsers page=${page} limit=${limit} search=${search} gender=${gender} state=${state} isBlocked=${isBlocked} subscriptionType=${subscriptionType} minAge=${minAge} maxAge=${maxAge} city=${city}`,
  );

  const filters = {
    search,
    gender,
    state,
    isBlocked,
    subscriptionType,
    minAge,
    maxAge,
    city,
  };

  const result = await findAllPaginated(page, limit, filters);
  const { items, ...meta } = result;
  return {
    users: items,
    ...meta,
  };
};

export const disableUserService = async (userId) => {
  logger.info(`Service:disableUser userId=${userId}`);
  const user = await findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.role === USER_ROLES.ADMIN) {
    throw new Error("Admin status cannot be toggled");
  }
  const currentState = user.status?.state || ACCOUNT_STATUS.ACTIVE;
  const nextState =
    currentState === ACCOUNT_STATUS.ACTIVE
      ? ACCOUNT_STATUS.INACTIVE
      : ACCOUNT_STATUS.ACTIVE;
  const updated = await updateById(userId, {
    "status.state": nextState,
    "status.isBlocked": nextState === ACCOUNT_STATUS.INACTIVE,
  });
  return updated;
};
