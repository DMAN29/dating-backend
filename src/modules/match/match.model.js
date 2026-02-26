import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Prevent duplicate pair
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

// Fast lookup
matchSchema.index({ user1: 1 });
matchSchema.index({ user2: 1 });

export default mongoose.model("Match", matchSchema);
