import Match from "./match.model.js";
import { paginate } from "../../shared/utils/pagination.js";

export const createMatch = async (userA, userB) => {
  const sortedUsers = [userA, userB].map((id) => id.toString()).sort();

  return await Match.findOneAndUpdate(
    { users: sortedUsers },
    { users: sortedUsers },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
};

export const findMatchBetweenUsers = async (userA, userB) => {
  const sortedUsers = [userA, userB].map((id) => id.toString()).sort();

  return await Match.findOne({
    users: sortedUsers,
    isDeleted: { $ne: true },
  });
};

export const findMatchesByUser = async (userId) => {
  return await Match.find({
    users: userId,
    isDeleted: { $ne: true },
  })
    .populate("users", "firstName lastName profilePhotos bio")
    .sort({ matchedAt: -1 });
};

export const findMatchedUserIds = async (userId) => {
  const matches = await Match.find({
    users: userId,
    isDeleted: { $ne: true },
  }).select("users");

  return matches.flatMap((m) =>
    m.users.filter((id) => id.toString() !== userId.toString()),
  );
};

export const findMatchesByUserPaginated = async (
  userId,
  page = 1,
  limit = 10,
) => {
  return paginate({
    model: Match,
    filter: {
      users: userId,
      isDeleted: { $ne: true },
    },
    page,
    limit,
    sort: { matchedAt: -1 },
    populate: {
      path: "users",
      select: "firstName lastName profilePhotos bio",
    },
  });
};

export const softDeleteMatch = async (matchId) => {
  return await Match.findByIdAndUpdate(
    matchId,
    { isDeleted: true },
    { new: true },
  );
};

export const findActiveMatchForUser = async (matchId, userId) => {
  return await Match.findOne({
    _id: matchId,
    users: userId,
    isDeleted: { $ne: true },
  });
};

export const findAllMatchesPaginated = async (page = 1, limit = 10) => {
  return paginate({
    model: Match,
    filter: { isDeleted: { $ne: true } },
    page,
    limit,
    sort: { matchedAt: -1 },
    populate: {
      path: "users",
      select: "firstName lastName email gender",
    },
  });
};
