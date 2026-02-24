import Conversation from "./conversation.model.js";
import Message from "./message.model.js";

/* ==============================
   CONVERSATION QUERIES
============================== */

// Get all conversations for a user
export const findUserConversations = async (userId) => {
  return Conversation.find({
    participants: userId,
    isActive: true,
  })
    .populate("participants", "firstName lastName profilePhoto")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });
};

// Get conversation by ID
export const findConversationById = async (conversationId) => {
  return Conversation.findById(conversationId);
};

// Create conversation (called after match)
export const createConversation = async (data) => {
  return Conversation.create(data);
};

// Update last message metadata
export const updateLastMessage = async (conversationId, messageId) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: messageId,
      lastMessageAt: new Date(),
    },
    { new: true },
  );
};

/* ==============================
   MESSAGE QUERIES
============================== */

// Get paginated messages
export const findMessages = async (conversationId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  return Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Bulk insert messages (for Redis flush)
export const insertMessagesBulk = async (messages) => {
  return Message.insertMany(messages);
};

// Mark messages as delivered
export const markMessagesDelivered = async (conversationId, receiverId) => {
  return Message.updateMany(
    {
      conversationId,
      receiver: receiverId,
      status: "sent",
    },
    {
      status: "delivered",
      deliveredAt: new Date(),
    },
  );
};

// Mark messages as seen
export const markMessagesSeen = async (conversationId, receiverId) => {
  return Message.updateMany(
    {
      conversationId,
      receiver: receiverId,
      status: { $in: ["sent", "delivered"] },
    },
    {
      status: "seen",
      seenAt: new Date(),
    },
  );
};

// Count unread messages
export const countUnreadMessages = async (conversationId, userId) => {
  return Message.countDocuments({
    conversationId,
    receiver: userId,
    status: { $ne: "seen" },
  });
};
