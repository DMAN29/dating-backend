import * as userService from "./user.service.js";
import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";
import logger from "../../shared/utils/logger.js";

/**
 * Controller for handling User related requests
 */

export const getProfile = async (req, res) => {
  logger.info(`Fetching profile for user: ${req.user.id}`);
  try {
    const user = await userService.getProfile(req.user.id);
    return sendSuccess(res, 200, "User profile fetched successfully", user);
  } catch (error) {
    logger.error(
      `Failed to fetch profile for user ${req.user.id}: ${error.message}`,
    );
    return sendError(res, 404, error.message || "User not found");
  }
};

export const updateProfile = async (req, res) => {
  logger.info(`Updating profile for user: ${req.user.id}`);
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    logger.info(`Profile updated successfully for user: ${req.user.id}`);
    return sendSuccess(res, 200, "Profile updated successfully", user);
  } catch (error) {
    logger.error(
      `Profile update failed for user ${req.user.id}: ${error.message}`,
    );
    return sendError(res, 400, error.message || "Profile update failed");
  }
};

export const addAdmin = async (req, res) => {
  logger.info(`Admin ${req.user.id} is adding a new admin: ${req.body.email}`);
  try {
    const admin = await userService.createAdmin(req.body);
    logger.info(`New admin added successfully: ${admin.email}`);
    return sendSuccess(res, 201, "Admin added successfully", admin);
  } catch (error) {
    logger.error(`Failed to add admin: ${error.message}`);
    return sendError(res, 400, error.message || "Failed to add admin");
  }
};

export const deleteAdmin = async (req, res) => {
  logger.info(`Admin ${req.user.id} is deleting user: ${req.params.id}`);
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    logger.info(`User ${id} deleted successfully by admin ${req.user.id}`);
    return sendSuccess(res, 200, "User deleted successfully");
  } catch (error) {
    logger.error(`Failed to delete user ${req.params.id}: ${error.message}`);
    return sendError(res, 400, error.message || "Failed to delete user");
  }
};
