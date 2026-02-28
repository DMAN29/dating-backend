import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
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

    deliveryNotified: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

// Performance indexes
// Pagination
messageSchema.index({ matchId: 1, createdAt: -1 });

// Delivery queries
messageSchema.index({ receiver: 1, status: 1 });

// Sync delivered queries
messageSchema.index({ sender: 1, status: 1, deliveryNotified: 1 });

export default mongoose.model("Message", messageSchema);
