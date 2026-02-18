import {
  getMyMatchesService,
  unmatchService,
  getAllMatchesAdminService,
} from "./match.service.js";
import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";
import logger from "../../shared/utils/logger.js";

export const getMyMatchesController = async (req, res) => {
  try {
    const matches = await getMyMatchesService(req.user.id);

    return sendSuccess(res, 200, "Matches fetched successfully", matches);
  } catch (error) {
    logger.error(`Failed to fetch matches: ${error.message}`);
    return sendError(res, 400, error.message);
  }
};

export const unmatchController = async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await unmatchService(req.user.id, matchId);

    return sendSuccess(res, 200, "Unmatched successfully", result);
  } catch (error) {
    logger.error(`Unmatch failed: ${error.message}`);
    return sendError(res, 400, error.message);
  }
};

export const adminGetAllMatchesController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await getAllMatchesAdminService(page, limit);
    return sendSuccess(res, 200, "Matches fetched successfully", data);
  } catch (error) {
    logger.error(`Failed to fetch matches for admin: ${error.message}`);
    return sendError(res, 400, error.message);
  }
};
