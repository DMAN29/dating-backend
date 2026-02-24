import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "video", "voice"],
      default: "text",
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
      index: true,
    },

    deliveredAt: Date,
    seenAt: Date,

    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

/* ==============================
   INDEXES (VERY IMPORTANT)
============================== */

// Fast pagination
messageSchema.index({ conversationId: 1, createdAt: -1 });

// Fast unread count
messageSchema.index({
  conversationId: 1,
  receiver: 1,
  status: 1,
});

export default mongoose.model("Message", messageSchema);
