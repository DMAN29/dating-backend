// socket/socketUsers.js

/**
 * Online Users Runtime Store
 * ---------------------------------
 * Structure:
 * Map<userId, Set<socketId>>
 *
 * Why Set?
 * - Supports multi-device login
 * - Prevents duplicate socket entries
 */

const onlineUsers = new Map();

/**
 * Add a socket connection for a user
 */
export const addUser = (userId, socketId) => {
  const id = String(userId);

  if (!onlineUsers.has(id)) {
    onlineUsers.set(id, new Set());
  }

  onlineUsers.get(id).add(socketId);
};

/**
 * Remove a specific socket connection
 */
export const removeUser = (userId, socketId) => {
  const id = String(userId);

  if (!onlineUsers.has(id)) return;

  const userSockets = onlineUsers.get(id);
  userSockets.delete(socketId);

  // If no active sockets left → remove user
  if (userSockets.size === 0) {
    onlineUsers.delete(id);
  }
};

/**
 * Check if user is online
 */
export const isUserOnline = (userId) => {
  return onlineUsers.has(String(userId));
};

/**
 * Get all socket IDs of a user
 */
export const getUserSockets = (userId) => {
  return onlineUsers.get(String(userId)) || new Set();
};

/**
 * Debug helper (optional)
 */
export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};
