import {
  getProfileService,
  updateProfileService,
  deleteUserService,
  getAllUsersService,
  disableUserService,
  getUserByIdService,
} from "./user.service.js";
import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";
import logger from "../../shared/utils/logger.js";
import { AUTH_PROVIDERS } from "../../shared/constants/user.constants.js";

export const getProfileController = async (req, res) => {
  logger.info(`Fetching profile for user: ${req.user.id}`);
  try {
    const user = await getProfileService(req.user.id);
    return sendSuccess(res, 200, "User profile fetched successfully", user);
  } catch (error) {
    logger.error(
      `Failed to fetch profile for user ${req.user.id}: ${error.message}`,
    );
    return sendError(res, 404, error.message || "User not found");
  }
};

export const updateProfileController = async (req, res) => {
  logger.info(`Updating profile for user: ${req.user.id}`);

  try {
    // 🛡 Always block protected fields
    delete req.body.role;
    delete req.body.status;
    delete req.body.googleId;
    delete req.body.authProvider;

    // 🔐 Provider-based restrictions
    if (
      req.user.authProvider === AUTH_PROVIDERS.EMAIL ||
      req.user.authProvider === AUTH_PROVIDERS.GOOGLE
    ) {
      delete req.body.email;
    }

    if (req.user.authProvider === AUTH_PROVIDERS.PHONE) {
      delete req.body.phoneNumber;
    }

    const user = await updateProfileService(req.user.id, req.body);

    logger.info(`Profile updated successfully for user: ${req.user.id}`);

    return sendSuccess(res, 200, "Profile updated successfully", user);
  } catch (error) {
    logger.error(
      `Profile update failed for user ${req.user.id}: ${error.message}`,
    );
    return sendError(res, 400, error.message || "Profile update failed");
  }
};

export const deleteUserController = async (req, res) => {
  logger.info(`Admin ${req.user.id} is deleting user: ${req.params.id}`);
  try {
    const { id } = req.params;
    await deleteUserService(id);
    logger.info(`User ${id} deleted successfully by admin ${req.user.id}`);
    return sendSuccess(res, 200, "User deleted successfully");
  } catch (error) {
    logger.error(`Failed to delete user ${req.params.id}: ${error.message}`);
    return sendError(res, 400, error.message || "Failed to delete user");
  }
};

export const getAllUsersController = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  logger.info(
    `Admin ${req.user.id} fetching users page=${page} limit=${limit}`,
  );
  try {
    const result = await getAllUsersService(page, limit);
    return sendSuccess(res, 200, "Users fetched successfully", result);
  } catch (error) {
    logger.error(`Failed to fetch users: ${error.message}`);
    return sendError(res, 400, error.message || "Failed to fetch users");
  }
};

export const getUserByIdController = async (req, res) => {
  logger.info(
    `Admin ${req.user.id} fetching full profile of user ${req.params.id}`,
  );

  try {
    const user = await getUserByIdService(req.params.id);

    return sendSuccess(res, 200, "User profile fetched successfully", user);
  } catch (error) {
    logger.error(`Failed to fetch user ${req.params.id}: ${error.message}`);
    return sendError(res, 404, error.message || "User not found");
  }
};

export const disableUserController = async (req, res) => {
  const { id } = req.params;
  logger.info(`Admin ${req.user.id} toggling status for user ${id}`);
  try {
    const user = await disableUserService(id);
    const {
      firstName,
      lastName,
      email,
      gender,
      dateOfBirth,
      phoneNumber,
      role,
      status,
    } = user;
    return sendSuccess(res, 200, "User status toggled successfully", {
      firstName,
      lastName,
      email,
      gender,
      dateOfBirth,
      phoneNumber,
      role,
      status,
    });
  } catch (error) {
    logger.error(`Failed to update user status ${id}: ${error.message}`);
    return sendError(res, 400, error.message || "Failed to update user status");
  }
};
