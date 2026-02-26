// import { redisClient } from "../../config/redisClient.js";

// /* ==============================
//    CACHE MESSAGE (RPUSH)
// ============================== */

// export const cacheMessage = async (conversationId, message) => {
//   const key = `chat:${conversationId}`;

//   try {
//     await redisClient.rPush(key, JSON.stringify(message));

//     // Set TTL only if key is new
//     const ttl = await redisClient.ttl(key);
//     if (ttl === -1) {
//       await redisClient.expire(key, 3600); // 1 hour
//     }
//   } catch (error) {
//     console.error("Redis cacheMessage error:", error.message);
//     throw error;
//   }
// };

// /* ==============================
//    GET BUFFERED MESSAGES
// ============================== */

// export const getBufferedMessages = async (conversationId) => {
//   const key = `chat:${conversationId}`;

//   try {
//     const messages = await redisClient.lRange(key, 0, -1);

//     return messages.map((msg) => JSON.parse(msg));
//   } catch (error) {
//     console.error("Redis getBufferedMessages error:", error.message);
//     return [];
//   }
// };

// /* ==============================
//    CLEAR BUFFER
// ============================== */

// export const clearBufferedMessages = async (conversationId) => {
//   const key = `chat:${conversationId}`;

//   try {
//     await redisClient.del(key);
//   } catch (error) {
//     console.error("Redis clearBufferedMessages error:", error.message);
//   }
// };

// /* ==============================
//    GET ALL ACTIVE CHAT KEYS
// ============================== */

// export const getAllChatKeys = async () => {
//   try {
//     return await redisClient.keys("chat:*");
//   } catch (error) {
//     console.error("Redis getAllChatKeys error:", error.message);
//     return [];
//   }
// };
