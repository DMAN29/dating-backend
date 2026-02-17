import mongoose from "mongoose";

const swipeSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["accept", "reject"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// 🚀 Prevent duplicate swipe
swipeSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const Swipe = mongoose.model("Swipe", swipeSchema);

export default Swipe;
