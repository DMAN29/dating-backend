import http from "http";

import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB } from "./config/database.js";
import { connectRedis } from "./config/redisClient.js";
import { initSocket } from "./socket/socket.js";
import logger from "./shared/utils/logger.js";
import { startChatFlushWorker } from "./modules/chat/chat.flush.worker.js";

/* -------------------------
   CREATE HTTP SERVER
-------------------------- */

const server = http.createServer(app);

/* -------------------------
   INITIALIZE SOCKET
-------------------------- */

initSocket(server);

/* -------------------------
   START SERVER
-------------------------- */

const start = async () => {
  await connectDB();
  await connectRedis();

  startChatFlushWorker();

  server.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
};

start();
