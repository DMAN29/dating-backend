import Match from "../match/match.model.js";
import {
  findUserMatches,
  findMatchById,
  findMessages,
  createMessage,
  markMessagesDelivered,
  markMessagesSeen,
  countUnreadMessages,
  findUndeliveredMessages,
  markMessagesDeliveredBulk,
  findDeliveredNotNotified,
  markDeliveryNotifiedBulk,
  countMessages,
} from "./chat.repository.js";

/* =====================================================
   GET CHAT LIST
===================================================== */

export const getConversationsService = async (userId) => {
  if (!userId) throw new Error("Unauthorized");

  const matches = await findUserMatches(userId);

  return matches.map((match) => {
    const isUser1 = String(match.user1._id) === String(userId);

    const otherUser = isUser1 ? match.user2 : match.user1;

    return {
      matchId: match._id,
      user: otherUser,
      isBlocked: match.isBlocked,
      blockedBy: match.blockedBy?._id || null,
      updatedAt: match.updatedAt,
    };
  });
};

/* =====================================================
   GET MESSAGES
===================================================== */

export const getMessagesService = async (userId, matchId, page, limit) => {
  const match = await findMatchById(matchId);
  if (!match) throw new Error("Match not found");

  const isParticipant =
    match.user1.toString() === userId.toString() ||
    match.user2.toString() === userId.toString();

  if (!isParticipant) throw new Error("Unauthorized");

  const messages = await findMessages(matchId, page, limit);
  const total = await countMessages(matchId);

  const totalPages = Math.ceil(total / limit);

  return {
    messages,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages,
    isBlocked: match.isBlocked,
    blockedBy: match.blockedBy,
  };
};

/* =====================================================
   SEND MESSAGE
===================================================== */

export const sendMessageService = async ({
  senderId,
  matchId,
  text,
  type = "text",
}) => {
  if (!senderId || !matchId) throw new Error("Invalid request");

  if (type === "text" && !text) throw new Error("Message cannot be empty");

  const match = await findMatchById(matchId);

  if (!match || match.isDeleted) throw new Error("Match not found");

  const isParticipant =
    match.user1.toString() === senderId.toString() ||
    match.user2.toString() === senderId.toString();

  if (!isParticipant) throw new Error("Unauthorized participant");

  // 🚫 Strict block rule
  if (match.isBlocked)
    throw new Error("Chat is blocked. Messaging is disabled.");

  const receiverId =
    match.user1.toString() === senderId.toString() ? match.user2 : match.user1;

  const message = await createMessage({
    matchId,
    sender: senderId,
    receiver: receiverId,
    text,
    type,
    status: "sent",
  });

  // Update chat order
  await Match.findByIdAndUpdate(matchId, {
    updatedAt: new Date(),
  });

  return message;
};

/* =====================================================
   MARK DELIVERED (MATCH LEVEL)
===================================================== */

export const markDeliveredService = async (matchId, userId) => {
  return markMessagesDelivered(matchId, userId);
};

/* =====================================================
   MARK SEEN
===================================================== */

export const markSeenService = async (matchId, userId) => {
  return markMessagesSeen(matchId, userId);
};

/* =====================================================
   UNREAD COUNT
===================================================== */

export const getUnreadCountService = async (matchId, userId) => {
  return countUnreadMessages(matchId, userId);
};

/* =====================================================
   🔥 ENTERPRISE ONLINE HANDLER
   (Called when user connects)
===================================================== */

export const handleUserOnline = async (userId) => {
  if (!userId) throw new Error("Invalid user");

  /* ===============================
     1️⃣ INCOMING UNDELIVERED
  =============================== */

  const undeliveredMessages = await findUndeliveredMessages(userId);

  if (undeliveredMessages.length > 0) {
    await markMessagesDeliveredBulk(userId);
  }

  /* ===============================
     2️⃣ SENT MESSAGES DELIVERED
        WHILE SENDER WAS OFFLINE
  =============================== */

  const deliveredNotNotified = await findDeliveredNotNotified(userId);

  const deliveredIds = deliveredNotNotified.map((m) => m._id);

  if (deliveredIds.length > 0) {
    await markDeliveryNotifiedBulk(deliveredIds);
  }

  return {
    newlyDelivered: undeliveredMessages,
    deliveredWhileOffline: deliveredNotNotified,
  };
};

/* =====================================================
   OPTIONAL: MANUAL DELIVERY SYNC
===================================================== */

export const syncDeliveredMessages = async (userId) => {
  if (!userId) throw new Error("Invalid user");

  const deliveredNotNotified = await findDeliveredNotNotified(userId);

  const deliveredIds = deliveredNotNotified.map((m) => m._id);

  if (deliveredIds.length > 0) {
    await markDeliveryNotifiedBulk(deliveredIds);
  }

  return deliveredNotNotified;
};
