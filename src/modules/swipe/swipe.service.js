import mongoose from "mongoose";
import { redisClient } from "../../config/redisClient.js";
import {
  createSwipe,
  findIncomingAcceptsPaginated,
  findAllSwipesPaginated,
} from "./swipe.repository.js";
import { findActiveById } from "../user/user.repository.js";
import { createMatchService } from "../match/match.service.js";

export const swipeService = async (currentUserId, targetUserId, action) => {
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new Error("Invalid target user ID");
  }

  if (currentUserId.toString() === targetUserId.toString()) {
    throw new Error("You cannot swipe yourself");
  }

  // 🔍 Validate target user
  const targetUser = await findActiveById(targetUserId);

  if (!targetUser) {
    throw new Error("Target user not found or inactive");
  }

  const swipedKey = `swiped:${currentUserId}`;
  const likeKey = `likes:${currentUserId}`;
  const reverseLikeKey = `likes:${targetUserId}`;

  // 🚀 Check duplicate swipe using Redis
  const alreadySwiped = await redisClient.sIsMember(
    swipedKey,
    targetUserId.toString(),
  );

  if (alreadySwiped) {
    throw new Error("You already swiped this user");
  }

  // 💾 Save in Mongo (source of truth)
  await createSwipe({
    fromUser: currentUserId,
    toUser: targetUserId,
    action,
  });

  // 🔄 Store in Redis
  await redisClient.sAdd(swipedKey, targetUserId.toString());

  let isMatch = false;
  let matchData = null;

  if (action === "accept") {
    // ❤️ Add like
    await redisClient.sAdd(likeKey, targetUserId.toString());

    // ⚡ Fast reverse like check
    const reverseLiked = await redisClient.sIsMember(
      reverseLikeKey,
      currentUserId.toString(),
    );

    if (reverseLiked) {
      isMatch = true;
      matchData = await createMatchService(currentUserId, targetUserId);
    }
  }

  return {
    isMatch,
    match: matchData,
  };
};

export const getAllSwipesAdminService = async (page, limit) => {
  return await findAllSwipesPaginated(page, limit);
};

export const getIncomingLikesService = async (userId, page, limit) => {
  return await findIncomingAcceptsPaginated(userId, page, limit);
};
