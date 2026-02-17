import { discoverService } from "./discover.service.js";
import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";
import logger from "../../shared/utils/logger.js";

export const discoverController = async (req, res) => {
  try {
    const { limit } = req.query;

    const users = await discoverService(req.user.id, limit || 20);

    return sendSuccess(res, 200, "Discover users fetched successfully", users);
  } catch (error) {
    logger.error(`Discover failed: ${error.message}`);
    return sendError(res, 400, error.message);
  }
};
