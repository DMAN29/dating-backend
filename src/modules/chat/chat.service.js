import {
  findUserConversations,
  findConversationById,
  findMessages,
  markMessagesDelivered,
  markMessagesSeen,
  countUnreadMessages,
  findMatchById,
} from "./chat.repository.js";

import { cacheMessage } from "./chat.redis.service.js";
import messageModel from "./message.model.js";

/* ==============================
   GET USER CONVERSATIONS
============================== */

export const getConversationsService = async (userId) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return findUserConversations(userId);
};

/* ==============================
   GET MESSAGES (PAGINATED)
============================== */

export const getMessagesService = async (
  userId,
  matchId,
  page,
  limit,
) => {
  if (!matchId) {
    throw new Error("Conversation not found");
  }

  const conversation = await findConversationById(matchId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === userId.toString(),
  );

  if (!isParticipant) {
    throw new Error("Unauthorized");
  }

  return findMessages(matchId, page, limit);
};

/* ==============================
   SEND MESSAGE (Redis Buffer)
============================== */

export const sendMessageService = async ({
  senderId,
  matchId,
  text,
  type = "text",
}) => {
  if (!matchId || !senderId) {
    throw new Error("senderId or matchId is missing");
  }

  if (!text && type === "text") {
    throw new Error("Message cannot be empty");
  }

  const conversation = await findMatchById(matchId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.users.some(
    (p) => p.toString() === senderId.toString(),
  );

  if (!isParticipant) {
    throw new Error("Unauthorized Participant");
  }

  const receiverId = conversation.users.find(
    (p) => p.toString() !== senderId.toString(),
  );

  const message = {
    matchId,
    sender: senderId,
    receiver: receiverId,
    text,
    type,
    status: "sent",
    createdAt: new Date(),
  };

  (async function (){
    await messageModel.create(message);
  })();

  return message;
};

/* ==============================
   MARK DELIVERED
============================== */

export const markDeliveredService = async (matchId, userId) => {
  if (!matchId || !userId) {
    throw new Error("Invalid request");
  }

  return markMessagesDelivered(matchId, userId);
};

/* ==============================
   MARK SEEN
============================== */

export const markSeenService = async (matchId, userId) => {
  if (!matchId || !userId) {
    throw new Error("Invalid request");
  }

  return markMessagesSeen(matchId, userId);
};

/* ==============================
   UNREAD COUNT
============================== */

export const getUnreadCountService = async (matchId, userId) => {
  if (!matchId || !userId) {
    throw new Error("Invalid request");
  }

  return countUnreadMessages(matchId, userId);
};
