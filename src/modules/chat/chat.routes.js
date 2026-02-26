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

// GET /api/chat/:matchId/messages
router.get("/:matchId/messages", getMessagesController);

// GET /api/chat/:matchId/unread-count
router.get("/:matchId/unread-count", getUnreadCountController);

export default router;
