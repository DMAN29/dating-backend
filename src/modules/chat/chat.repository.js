import Match from "../match/match.model.js";
import Message from "./message.model.js";

/* =====================================================
   MATCH QUERIES
===================================================== */

export const findUserMatches = async (userId) => {
  return Match.find({
    $or: [{ user1: userId }, { user2: userId }],
    isDeleted: { $ne: true },
  })
    .select("user1 user2 isBlocked blockedBy updatedAt")
    .populate("user1", "firstName lastName profilePhotos")
    .populate("user2", "firstName lastName profilePhotos")
    .populate("blockedBy", "firstName lastName")
    .sort({ updatedAt: -1 });
};

export const findMatchById = async (matchId) => {
  return Match.findOne({
    _id: matchId,
    isDeleted: { $ne: true },
  });
};

/* =====================================================
   MESSAGE CREATION
===================================================== */

export const createMessage = async (data) => {
  return Message.create(data);
};

/* =====================================================
   MESSAGE FETCH (PAGINATION)
===================================================== */

export const findMessages = async (matchId, page, limit) => {
  const skip = (page - 1) * limit;

  return Message.find({ matchId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/* =====================================================
   DELIVERY / SEEN UPDATES (MATCH LEVEL)
===================================================== */

export const markMessagesDelivered = async (matchId, userId) => {
  return Message.updateMany(
    {
      matchId,
      receiver: userId,
      status: "sent",
    },
    {
      status: "delivered",
      deliveredAt: new Date(),
    },
  );
};

export const markMessagesSeen = async (matchId, userId) => {
  return Message.updateMany(
    {
      matchId,
      receiver: userId,
      status: { $in: ["sent", "delivered"] },
    },
    {
      status: "seen",
      seenAt: new Date(),
    },
  );
};

export const countUnreadMessages = async (matchId, userId) => {
  return Message.countDocuments({
    matchId,
    receiver: userId,
    status: { $ne: "seen" },
  });
};

/* =====================================================
   🔥 ENTERPRISE DELIVERY SYNC HELPERS
===================================================== */

/**
 * 1️⃣ Find all undelivered incoming messages
 * Used when user comes online
 */
export const findUndeliveredMessages = async (userId) => {
  return Message.find({
    receiver: userId,
    status: "sent",
  });
};

/**
 * 2️⃣ Mark all pending incoming messages as delivered
 */
export const markMessagesDeliveredBulk = async (userId) => {
  return Message.updateMany(
    {
      receiver: userId,
      status: "sent",
    },
    {
      status: "delivered",
      deliveredAt: new Date(),
    },
  );
};

/**
 * 3️⃣ Find delivered messages not yet notified to sender
 * Used when sender reconnects
 */
export const findDeliveredNotNotified = async (userId) => {
  return Message.find({
    sender: userId,
    status: "delivered",
    deliveryNotified: false,
  });
};

/**
 * 4️⃣ Mark delivery notification as sent
 */
export const markDeliveryNotifiedBulk = async (messageIds) => {
  return Message.updateMany(
    {
      _id: { $in: messageIds },
    },
    {
      deliveryNotified: true,
    },
  );
};

export const countMessages = async (matchId) => {
  return Message.countDocuments({ matchId });
};
