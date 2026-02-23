import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import logger from "../shared/utils/logger.js";

const socketAuth = (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      logger.warn("Socket connection rejected: No token provided");
      return next(new Error("Authentication error: No token"));
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    // Attach user to socket
    socket.user = decoded;

    // Join personal room (multi-device support)
    const userId = decoded.id || decoded._id || decoded.userId;
    socket.join(userId);

    next();
  } catch (err) {
    logger.warn("Socket authentication failed:", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
};

export default socketAuth;
