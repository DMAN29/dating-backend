import {
  findUserConversations,
  findConversationById,
  findMessages,
  markMessagesDelivered,
  markMessagesSeen,
  countUnreadMessages,
} from "./chat.repository.js";

import { cacheMessage } from "./chat.redis.service.js";

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
  conversationId,
  page,
  limit,
) => {
  if (!conversationId) {
    throw new Error("Conversation not found");
  }

  const conversation = await findConversationById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === userId.toString(),
  );

  if (!isParticipant) {
    throw new Error("Unauthorized");
  }

  return findMessages(conversationId, page, limit);
};

/* ==============================
   SEND MESSAGE (Redis Buffer)
============================== */

export const sendMessageService = async ({
  senderId,
  conversationId,
  text,
  type = "text",
}) => {
  if (!conversationId || !senderId) {
    throw new Error("Invalid request");
  }

  if (!text && type === "text") {
    throw new Error("Message cannot be empty");
  }

  const conversation = await findConversationById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === senderId.toString(),
  );

  if (!isParticipant) {
    throw new Error("Unauthorized");
  }

  const receiverId = conversation.participants.find(
    (p) => p.toString() !== senderId.toString(),
  );

  const message = {
    conversationId,
    sender: senderId,
    receiver: receiverId,
    text,
    type,
    status: "sent",
    createdAt: new Date(),
  };

  await cacheMessage(conversationId, message);

  return message;
};

/* ==============================
   MARK DELIVERED
============================== */

export const markDeliveredService = async (conversationId, userId) => {
  if (!conversationId || !userId) {
    throw new Error("Invalid request");
  }

  return markMessagesDelivered(conversationId, userId);
};

/* ==============================
   MARK SEEN
============================== */

export const markSeenService = async (conversationId, userId) => {
  if (!conversationId || !userId) {
    throw new Error("Invalid request");
  }

  return markMessagesSeen(conversationId, userId);
};

/* ==============================
   UNREAD COUNT
============================== */

export const getUnreadCountService = async (conversationId, userId) => {
  if (!conversationId || !userId) {
    throw new Error("Invalid request");
  }

  return countUnreadMessages(conversationId, userId);
};
