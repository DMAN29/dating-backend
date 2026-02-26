import {
  sendMessageService,
  markDeliveredService,
  markSeenService,
} from "./chat.service.js";
import { findMatchById } from "./chat.repository.js";

const registerChatSocket = (io, socket) => {
  const senderId = String(socket.user.id || socket.user._id || socket.user.userId);

  socket.on("send_message", async (data) => {
    try {
      const { matchId, text, type } = data;

      const message = await sendMessageService({
        senderId,
        matchId,
        text,
        type,
      });

      io.to(String(message.receiver)).emit("receive_message", message);

      socket.emit("message_sent", message);
    } catch (error) {
      socket.emit("message_error", {
        message: error.message,
      });
    }
  });

  socket.on("message_delivered", async ({ matchId }) => {
    await markDeliveredService(matchId, senderId);
  });

  socket.on("message_seen", async ({ matchId }) => {
    await markSeenService(matchId, senderId);

    const match = await findMatchById(matchId);
    if (!match) return;

    const receiverId =
      String(match.user1) === String(senderId) ? match.user2 : match.user1;

    io.to(String(receiverId)).emit("seen_update", {
      matchId,
      seenBy: senderId,
    });
  });
};

export default registerChatSocket;
