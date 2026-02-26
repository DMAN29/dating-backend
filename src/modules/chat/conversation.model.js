// import mongoose from "mongoose";

// const conversationSchema = new mongoose.Schema(
//   {
//     participants: {
//       type: [
//         {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//       ],
//       validate: {
//         validator: function (val) {
//           return val.length === 2; // Only 1-to-1 chat
//         },
//         message: "Conversation must have exactly 2 participants",
//       },
//       required: true,
//     },

//     matchId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Match",
//       required: true,
//       unique: true,
//       index: true,
//     },

//     lastMessage: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Message",
//     },

//     lastMessageAt: {
//       type: Date,
//       index: true, // Important for sorting conversations
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//       index: true,
//     },
//   },
//   { timestamps: true },
// );

// /* ==============================
//    INDEXES
// ============================== */

// // Fast lookup for user conversations
// conversationSchema.index({ participants: 1 });

// // For conversation sorting
// conversationSchema.index({ lastMessageAt: -1 });

// export default mongoose.model("Conversation", conversationSchema);
