import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: {
        validator: function (val) {
          return val.length === 2;
        },
        message: "Match must contain exactly 2 users",
      },
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

// Prevent duplicate match for same 2 users
matchSchema.index({ users: 1 }, { unique: true });

const Match = mongoose.model("Match", matchSchema);

export default Match;
