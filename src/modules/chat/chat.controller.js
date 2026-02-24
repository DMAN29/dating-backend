import {
  getConversationsService,
  getMessagesService,
  getUnreadCountService,
} from "./chat.service.js";

import { sendSuccess } from "../../shared/utils/responseFormatter.js";
import logger from "../../shared/utils/logger.js";

/* ==============================
   GET ALL CONVERSATIONS
============================== */

export const getConversationsController = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    const conversations = await getConversationsService(userId);

    return sendSuccess(
      res,
      200,
      "Conversations fetched successfully",
      conversations,
    );
  } catch (error) {
    logger.error("Get Conversations Error:", error.message);
    next(error);
  }
};

/* ==============================
   GET MESSAGES (PAGINATION)
============================== */

export const getMessagesController = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { conversationId } = req.params;

    const page = Math.max(1, Number(req.query.page) || 1);

    const limit = Math.min(50, Number(req.query.limit) || 20);

    const messages = await getMessagesService(
      userId,
      conversationId,
      page,
      limit,
    );

    return sendSuccess(res, 200, "Messages fetched successfully", messages);
  } catch (error) {
    logger.error("Get Messages Error:", error.message);
    next(error);
  }
};

/* ==============================
   GET UNREAD COUNT
============================== */

export const getUnreadCountController = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { conversationId } = req.params;

    const count = await getUnreadCountService(conversationId, userId);

    return sendSuccess(res, 200, "Unread count fetched successfully", count);
  } catch (error) {
    logger.error("Unread Count Error:", error.message);
    next(error);
  }
};
