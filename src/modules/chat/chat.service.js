import Match from "../match/match.model.js";
import {
  findUserMatches,
  findMatchById,
  findMessages,
  createMessage,
  markMessagesDelivered,
  markMessagesSeen,
  countUnreadMessages,
} from "./chat.repository.js";

/* GET CHAT LIST */
export const getConversationsService = async (userId) => {
  if (!userId) throw new Error("Unauthorized");
  return findUserMatches(userId);
};

/* GET MESSAGES */
export const getMessagesService = async (userId, matchId, page, limit) => {
  const match = await findMatchById(matchId);
  if (!match) throw new Error("Match not found");

  const isParticipant =
    match.user1.toString() === userId.toString() ||
    match.user2.toString() === userId.toString();

  if (!isParticipant) throw new Error("Unauthorized");

  return findMessages(matchId, page, limit);
};

/* SEND MESSAGE */
export const sendMessageService = async ({
  senderId,
  matchId,
  text,
  type = "text",
}) => {
  if (!senderId || !matchId) throw new Error("Invalid request");

  if (type === "text" && !text) throw new Error("Message cannot be empty");

  const match = await findMatchById(matchId);
  if (!match) throw new Error("Match not found");

  const isParticipant =
    match.user1.toString() === senderId.toString() ||
    match.user2.toString() === senderId.toString();

  if (!isParticipant) throw new Error("Unauthorized participant");

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

  // 🔥 Important: Update chat order
  await Match.findByIdAndUpdate(matchId, {
    updatedAt: new Date(),
  });

  return message;
};

export const markDeliveredService = async (matchId, userId) => {
  return markMessagesDelivered(matchId, userId);
};

export const markSeenService = async (matchId, userId) => {
  return markMessagesSeen(matchId, userId);
};

export const getUnreadCountService = async (matchId, userId) => {
  return countUnreadMessages(matchId, userId);
};
