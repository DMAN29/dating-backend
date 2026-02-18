import { swipeService, getAllSwipesAdminService } from "./swipe.service.js";
import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";
import logger from "../../shared/utils/logger.js";

export const swipeController = async (req, res) => {
  const currentUserId = req.user.id;
  const { targetUserId, action } = req.body;

  logger.info(`User ${currentUserId} performed ${action} on ${targetUserId}`);

  try {
    const result = await swipeService(currentUserId, targetUserId, action);

    return sendSuccess(res, 200, "Swipe recorded successfully", result);
  } catch (error) {
    logger.error(`Swipe failed for user ${currentUserId}: ${error.message}`);
    return sendError(res, 400, error.message || "Swipe failed");
  }
};

export const adminGetAllSwipesController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await getAllSwipesAdminService(page, limit);
    return sendSuccess(res, 200, "Swipes fetched successfully", data);
  } catch (error) {
    logger.error(`Failed to fetch swipes: ${error.message}`);
    return sendError(res, 400, error.message);
  }
};
