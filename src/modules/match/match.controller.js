import {
  getMyMatchesService,
  unmatchService,
  getAllMatchesAdminService,
  unblockUserService,
  blockUserService,
  getAllBlockedMatchesAdminService,
} from "./match.service.js";
import {
  sendSuccess,
  sendError,
} from "../../shared/utils/responseFormatter.js";
import logger from "../../shared/utils/logger.js";

export const getMyMatchesController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await getMyMatchesService(req.user.id, page, limit);

    return sendSuccess(res, 200, "Matches fetched successfully", data);
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

export const blockUserController = async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await blockUserService(req.user.id, matchId);

    return sendSuccess(res, 200, "User blocked successfully", result);
  } catch (error) {
    logger.error(`Block failed: ${error.message}`);
    return sendError(res, 400, error.message);
  }
};

export const unblockUserController = async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await unblockUserService(req.user.id, matchId);

    return sendSuccess(res, 200, "User unblocked successfully", result);
  } catch (error) {
    logger.error(`Unblock failed: ${error.message}`);
    return sendError(res, 400, error.message);
  }
};

export const adminGetBlockedMatchesController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const data = await getAllBlockedMatchesAdminService(page, limit);

    return sendSuccess(res, 200, "Blocked matches fetched successfully", data);
  } catch (error) {
    logger.error(`Failed to fetch blocked matches: ${error.message}`);
    return sendError(res, 400, error.message);
  }
};
