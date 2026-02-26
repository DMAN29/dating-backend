import Match from "../match/match.model.js";
import Message from "./message.model.js";

export const findUserMatches = async (userId) => {
  return (
    Match.find({
      $or: [{ user1: userId }, { user2: userId }],
      isDeleted: { $ne: true },
    })
      // 👇 ADD THIS
      .select("user1 user2 isBlocked blockedBy updatedAt")

      .populate("user1", "firstName lastName profilePhotos")
      .populate("user2", "firstName lastName profilePhotos")
      .populate("blockedBy", "firstName lastName") // optional but useful

      .sort({ updatedAt: -1 })
  );
};

export const findMatchById = async (matchId) => {
  return Match.findOne({
    _id: matchId,
    isDeleted: { $ne: true },
  });
};

export const createMessage = async (data) => {
  return Message.create(data);
};

export const findMessages = async (matchId, page, limit) => {
  const skip = (page - 1) * limit;

  return Message.find({ matchId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const markMessagesDelivered = async (matchId, userId) => {
  return Message.updateMany(
    { matchId, receiver: userId, status: "sent" },
    { status: "delivered", deliveredAt: new Date() },
  );
};

export const markMessagesSeen = async (matchId, userId) => {
  return Message.updateMany(
    {
      matchId,
      receiver: userId,
      status: { $in: ["sent", "delivered"] },
    },
    { status: "seen", seenAt: new Date() },
  );
};

export const countUnreadMessages = async (matchId, userId) => {
  return Message.countDocuments({
    matchId,
    receiver: userId,
    status: { $ne: "seen" },
  });
};
