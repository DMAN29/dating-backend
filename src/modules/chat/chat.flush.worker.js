import {
  getAllChatKeys,
  getBufferedMessages,
  clearBufferedMessages,
} from "./chat.redis.service.js";

import { insertMessagesBulk, updateLastMessage } from "./chat.repository.js";

import logger from "../../shared/utils/logger.js";

let isRunning = false;

export const startChatFlushWorker = () => {
  setInterval(async () => {
    if (isRunning) return; // Prevent overlapping runs
    isRunning = true;

    try {
      const keys = await getAllChatKeys();
      if (!keys.length) {
        isRunning = false;
        return;
      }

      for (const key of keys) {
        const conversationId = key.split(":")[1];

        const messages = await getBufferedMessages(conversationId);

        if (!messages.length) continue;

        try {
          // Insert into Mongo
          const insertedMessages = await insertMessagesBulk(messages);

          const lastMessage = insertedMessages[insertedMessages.length - 1];

          // Update conversation metadata
          await updateLastMessage(conversationId, lastMessage._id);

          // Clear Redis ONLY after successful insert
          await clearBufferedMessages(conversationId);

          logger.info(
            `Flushed ${messages.length} messages for conversation ${conversationId}`,
          );
        } catch (dbError) {
          logger.error(
            `DB Insert failed for ${conversationId}:`,
            dbError.message,
          );
          // DO NOT clear Redis if insert fails
        }
      }
    } catch (error) {
      logger.error("Chat flush worker error:", error.message);
    } finally {
      isRunning = false;
    }
  }, 5000);
};
