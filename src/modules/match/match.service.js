import mongoose from "mongoose";
import Match from "./match.model.js";
import {
  findMatchesByUserPaginated,
  findMatchBetweenUsers,
  softDeleteMatch,
  findAllMatchesPaginated,
} from "./match.repository.js";

export const getMyMatchesService = async (userId, page, limit) => {
  return await findMatchesByUserPaginated(userId, page, limit);
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

export const getAllMatchesAdminService = async (page, limit) => {
  return await findAllMatchesPaginated(page, limit);
};
