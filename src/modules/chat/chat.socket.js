import {
  sendMessageService,
  markDeliveredService,
  markSeenService,
} from "./chat.service.js";

import logger from "../../shared/utils/logger.js";
import { findConversationById } from "./chat.repository.js";

const registerChatSocket = (io, socket) => {
  const senderId = socket.user.id || socket.user._id || socket.user.userId;

  /* ==============================
     SEND MESSAGE
  ============================== */

  socket.on("send_message", async (data) => {
    try {
      const { conversationId, text, type } = data;

      if (!conversationId) {
        return socket.emit("message_error", {
          message: "Invalid conversation",
        });
      }

      const message = await sendMessageService({
        senderId,
        conversationId,
        text,
        type,
      });

      // Fetch once to determine receiver
      const conversation = await findConversationById(conversationId);

      if (!conversation) {
        return socket.emit("message_error", {
          message: "Conversation not found",
        });
      }

      const receiverId = conversation.participants.find(
        (p) => p.toString() !== senderId.toString(),
      );

      // Emit to receiver
      io.to(receiverId.toString()).emit("receive_message", message);

      // Confirm to sender
      socket.emit("message_sent", message);

      logger.info(`Message sent from ${senderId} to ${receiverId}`);
    } catch (error) {
      logger.error("Send message error:", error.message);
      socket.emit("message_error", {
        message: error.message,
      });
    }
  });

  /* ==============================
     MESSAGE DELIVERED
  ============================== */

  socket.on("message_delivered", async ({ conversationId }) => {
    try {
      if (!conversationId) return;

      await markDeliveredService(conversationId, senderId);

      socket.emit("delivered_ack", {
        conversationId,
      });
    } catch (error) {
      logger.error("Delivered error:", error.message);
    }
  });

  /* ==============================
     MESSAGE SEEN
  ============================== */

  socket.on("message_seen", async ({ conversationId }) => {
    try {
      if (!conversationId) return;

      await markSeenService(conversationId, senderId);

      const conversation = await findConversationById(conversationId);

      if (!conversation) return;

      conversation.participants.forEach((user) => {
        io.to(user.toString()).emit("seen_update", {
          conversationId,
          seenBy: senderId,
        });
      });
    } catch (error) {
      logger.error("Seen error:", error.message);
    }
  });

  /* ==============================
     TYPING START
  ============================== */

  socket.on("typing_start", async ({ conversationId }) => {
    if (!conversationId) return;

    const conversation = await findConversationById(conversationId);
    if (!conversation) return;

    const receiverId = conversation.participants.find(
      (p) => p.toString() !== senderId.toString(),
    );

    io.to(receiverId.toString()).emit("typing_start", {
      from: senderId,
    });
  });

  /* ==============================
     TYPING STOP
  ============================== */

  socket.on("typing_stop", async ({ conversationId }) => {
    if (!conversationId) return;

    const conversation = await findConversationById(conversationId);
    if (!conversation) return;

    const receiverId = conversation.participants.find(
      (p) => p.toString() !== senderId.toString(),
    );

    io.to(receiverId.toString()).emit("typing_stop", {
      from: senderId,
    });
  });
};

export default registerChatSocket;
