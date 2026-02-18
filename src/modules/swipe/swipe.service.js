import mongoose from "mongoose";
import {
  createSwipe,
  findReverseAcceptSwipe,
  findAllSwipesPaginated,
} from "./swipe.repository.js";
import Match from "../match/match.model.js";
import User from "../user/user.model.js";

export const swipeService = async (currentUserId, targetUserId, action) => {
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new Error("Invalid target user ID");
  }

  if (currentUserId.toString() === targetUserId.toString()) {
    throw new Error("You cannot swipe yourself");
  }

  // Check if target user exists and is active
  const targetUser = await User.findOne({
    _id: targetUserId,
    isDeleted: { $ne: true },
    "status.state": "active",
    "status.isBlocked": { $ne: true },
  });

  if (!targetUser) {
    throw new Error("Target user not found or inactive");
  }

  // Save swipe
  await createSwipe({
    fromUser: currentUserId,
    toUser: targetUserId,
    action,
  });

  let isMatch = false;
  let matchData = null;

  // Only check match if action is ACCEPT
  if (action === "accept") {
    const reverseSwipe = await findReverseAcceptSwipe(
      targetUserId,
      currentUserId,
    );

    if (reverseSwipe) {
      isMatch = true;

      // Prevent duplicate match creation
      const sortedUsers = [currentUserId, targetUserId]
        .map((id) => id.toString())
        .sort();

      matchData = await Match.findOneAndUpdate(
        { users: sortedUsers },
        { users: sortedUsers },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
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
