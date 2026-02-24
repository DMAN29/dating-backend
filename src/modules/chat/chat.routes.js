import express from "express";
import {
  getConversationsController,
  getMessagesController,
  getUnreadCountController,
} from "./chat.controller.js";

const router = express.Router();

/* ==============================
   CHAT ROUTES
============================== */

// GET /api/chat
router.get("/", getConversationsController);

// GET /api/chat/:conversationId/messages?page=1&limit=20
router.get("/:conversationId/messages", getMessagesController);

// GET /api/chat/:conversationId/unread-count
router.get("/:conversationId/unread-count", getUnreadCountController);

export default router;
