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
swipeSchema.index({ toUser: 1, action: 1 }); // Who liked me?
swipeSchema.index({ createdAt: -1 }); // Pagination / analytics
const Swipe = mongoose.model("Swipe", swipeSchema);

export default Swipe;
