import mongoose from "mongoose";
import {
  findMatchesByUserPaginated,
  findMatchBetweenUsers,
  softDeleteMatch,
  findActiveMatchForUser,
  findAllMatchesPaginated,
  createMatch,
} from "./match.repository.js";

export const createMatchService = async (userA, userB) => {
  if (
    !mongoose.Types.ObjectId.isValid(userA) ||
    !mongoose.Types.ObjectId.isValid(userB)
  ) {
    throw new Error("Invalid user IDs for match creation");
  }

  return await createMatch(userA, userB);
};
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

  const match = await findActiveMatchForUser(matchId, userId);

  if (!match) {
    throw new Error("Match not found or not authorized");
  }

  return await softDeleteMatch(matchId);
};

export const getAllMatchesAdminService = async (page, limit) => {
  return await findAllMatchesPaginated(page, limit);
};
