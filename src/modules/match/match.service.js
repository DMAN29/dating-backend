import mongoose from "mongoose";
import Match from "./match.model.js";
import {
  findMatchesByUser,
  findMatchBetweenUsers,
  softDeleteMatch,
} from "./match.repository.js";

export const getMyMatchesService = async (userId) => {
  return await findMatchesByUser(userId);
};

export const getMatchBetweenUsersService = async (userA, userB) => {
  return await findMatchBetweenUsers(userA, userB);
};

export const unmatchService = async (userId, matchId) => {
  if (!mongoose.Types.ObjectId.isValid(matchId)) {
    throw new Error("Invalid match ID");
  }

  const match = await Match.findOne({
    _id: matchId,
    users: userId,
    isDeleted: { $ne: true },
  });

  if (!match) {
    throw new Error("Match not found or not authorized");
  }

  return await softDeleteMatch(matchId);
};
