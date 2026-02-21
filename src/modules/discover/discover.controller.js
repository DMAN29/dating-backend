import { discoverService } from "./discover.service.js";
import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";
import logger from "../../shared/utils/logger.js";

export const discoverController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await discoverService(req.user, page, limit);
    const { items, ...meta } = result;

    return sendSuccess(res, 200, "Discover users fetched successfully", {
      users: items,
      ...meta,
    });
  } catch (error) {
    logger.error(`Discover failed: ${error.message}`);
    return sendError(res, 400, error.message);
  }
};
