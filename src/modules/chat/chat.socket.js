// import {
//   sendMessageService,
//   markDeliveredService,
//   markSeenService,
// } from "./chat.service.js";
// import { findMatchById } from "./chat.repository.js";

// const registerChatSocket = (io, socket) => {
//   const senderId = String(
//     socket.user.id || socket.user._id || socket.user.userId,
//   );

//   socket.on("send_message", async (data) => {
//     try {
//       const { matchId, text, type } = data;

//       const message = await sendMessageService({
//         senderId,
//         matchId,
//         text,
//         type,
//       });

//       io.to(String(message.receiver)).emit("receive_message", message);

//       socket.emit("message_sent", message);
//     } catch (error) {
//       socket.emit("message_error", {
//         message: error.message,
//       });
//     }
//   });

//   socket.on("message_delivered", async ({ matchId }) => {
//     await markDeliveredService(matchId, senderId);
//   });

//   socket.on("message_seen", async ({ matchId }) => {
//     await markSeenService(matchId, senderId);

//     const match = await findMatchById(matchId);
//     if (!match) return;

//     const receiverId =
//       String(match.user1) === String(senderId) ? match.user2 : match.user1;

//     io.to(String(receiverId)).emit("seen_update", {
//       matchId,
//       seenBy: senderId,
//     });
//   });
// };

// export default registerChatSocket;

import {
  sendMessageService,
  markDeliveredService,
  markSeenService,
} from "./chat.service.js";

import { findMatchById } from "./chat.repository.js";

const registerChatSocket = (io, socket) => {
  const userId = String(
    socket.user.id || socket.user._id || socket.user.userId,
  );

  /* =========================
     SEND MESSAGE
  ========================= */
  socket.on("send_message", async ({ matchId, text, type }) => {
    try {
      const message = await sendMessageService({
        senderId: userId,
        matchId,
        text,
        type,
      });

      const receiverId = String(message.receiver);

      /* 🔥 SENT (to sender) */
      socket.emit("message_status", {
        messageId: message._id,
        matchId,
        status: "sent",
        message, // full message only on send
        updatedBy: userId,
        timestamp: new Date(),
      });

      /* 🔥 DELIVERED (to receiver) */
      io.to(receiverId).emit("message_status", {
        messageId: message._id,
        matchId,
        status: "delivered",
        message, // receiver needs full message
        updatedBy: userId,
        timestamp: new Date(),
      });
    } catch (error) {
      socket.emit("message_error", {
        message: error.message,
      });
    }
  });

  /* =========================
     MESSAGE DELIVERED
     (optional manual trigger)
  ========================= */
  socket.on("message_delivered", async ({ matchId }) => {
    try {
      await markDeliveredService(matchId, userId);

      socket.emit("message_status", {
        matchId,
        status: "delivered",
        updatedBy: userId,
        timestamp: new Date(),
      });
    } catch (error) {
      socket.emit("message_error", {
        message: error.message,
      });
    }
  });

  /* =========================
     MESSAGE SEEN
  ========================= */
  socket.on("message_seen", async ({ matchId }) => {
    try {
      await markSeenService(matchId, userId);

      const match = await findMatchById(matchId);
      if (!match) return;

      const otherUserId =
        String(match.user1) === String(userId)
          ? String(match.user2)
          : String(match.user1);

      /* 🔥 SEEN (to other user) */
      io.to(otherUserId).emit("message_status", {
        matchId,
        status: "seen",
        updatedBy: userId,
        timestamp: new Date(),
      });
    } catch (error) {
      socket.emit("message_error", {
        message: error.message,
      });
    }
  });
};

export default registerChatSocket;
