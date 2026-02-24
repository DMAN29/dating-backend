import { Server } from "socket.io";
import socketAuth from "./socket.auth.js";
import logger from "../shared/utils/logger.js";
import registerChatSocket from "../modules/chat/chat.socket.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // change in production
      credentials: true,
    },
  });

  // Apply JWT auth middleware
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user.id || socket.user._id || socket.user.userId;

    logger.info(`User ${userId} connected`);

    registerChatSocket(io, socket);

    socket.on("disconnect", () => {
      logger.info(`User ${userId} disconnected`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
