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
      const { matchId, text, type } = data;

      if (!matchId) {
        return socket.emit("message_error", {
          message: "Invalid conversation",
        });
      }

      const message = await sendMessageService({
        senderId,
        matchId,
        text,
        type,
      });


      const {sender,receiver,status,createdAt} = message;

      // Emit to receiver
      io.to(receiver.toString()).emit("receive_message", message);

      // Confirm to sender
      //  socket.emit("message_sent", message);

      logger.info(`Message sent from ${senderId} to ${receiver}`);
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

  socket.on("message_delivered", async ({ matchId }) => {
    try {
      if (!matchId) return;

      await markDeliveredService(matchId, senderId);

      socket.emit("delivered_ack", {
        matchId,
      });
    } catch (error) {
      logger.error("Delivered error:", error.message);
    }
  });

  /* ==============================
     MESSAGE SEEN
  ============================== */

  socket.on("message_seen", async ({ matchId }) => {
    try {
      if (!matchId) return;

      await markSeenService(matchId, senderId);

      const conversation = await findConversationById(matchId);

      if (!conversation) return;

      conversation.participants.forEach((user) => {
        io.to(user.toString()).emit("seen_update", {
          matchId,
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

  socket.on("typing_start", async ({ matchId }) => {
    if (!matchId) return;

    const conversation = await findConversationById(matchId);
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

  socket.on("typing_stop", async ({ matchId }) => {
    if (!matchId) return;

    const conversation = await findConversationById(matchId);
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
