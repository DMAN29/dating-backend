import Match from "./match.model.js";
import { paginate } from "../../shared/utils/pagination.js";

/* =========================
   CREATE MATCH
========================= */

export const createMatch = async (userA, userB) => {
  const [user1, user2] = [userA, userB].map((id) => id.toString()).sort();

  return Match.findOneAndUpdate(
    { user1, user2 },
    { user1, user2 },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
};

/* =========================
   FIND MATCH BETWEEN USERS
========================= */

export const findMatchBetweenUsers = async (userA, userB) => {
  const [user1, user2] = [userA, userB].map((id) => id.toString()).sort();

  return Match.findOne({
    user1,
    user2,
    isDeleted: { $ne: true },
  });
};

/* =========================
   FIND MATCHES BY USER
========================= */

export const findMatchesByUserPaginated = async (
  userId,
  page = 1,
  limit = 10,
) => {
  return paginate({
    model: Match,
    filter: {
      $or: [{ user1: userId }, { user2: userId }],
      isDeleted: { $ne: true },
    },
    page,
    limit,
    sort: { updatedAt: -1 },
    populate: [
      {
        path: "user1",
        select: "firstName lastName profilePhotos bio",
      },
      {
        path: "user2",
        select: "firstName lastName profilePhotos bio",
      },
    ],
  });
};

/* =========================
   FIND ACTIVE MATCH FOR USER
========================= */

export const findActiveMatchForUser = async (matchId, userId) => {
  return Match.findOne({
    _id: matchId,
    $or: [{ user1: userId }, { user2: userId }],
    isDeleted: { $ne: true },
  });
};

/* =========================
   SOFT DELETE MATCH
========================= */

export const softDeleteMatch = async (matchId) => {
  return Match.findByIdAndUpdate(matchId, { isDeleted: true }, { new: true });
};

/* =========================
   ADMIN PAGINATED MATCHES
========================= */

export const findAllMatchesPaginated = async (page = 1, limit = 10) => {
  return paginate({
    model: Match,
    filter: { isDeleted: { $ne: true } },
    page,
    limit,
    sort: { updatedAt: -1 },
    populate: [
      {
        path: "user1",
        select: "firstName lastName email gender",
      },
      {
        path: "user2",
        select: "firstName lastName email gender",
      },
    ],
  });
};

/* =========================
   FIND MATCHED USER IDS
========================= */

export const findMatchedUserIds = async (userId) => {
  const matches = await Match.find({
    $or: [{ user1: userId }, { user2: userId }],
    isDeleted: { $ne: true },
  }).select("user1 user2");

  return matches.map((match) =>
    match.user1.toString() === userId.toString() ? match.user2 : match.user1,
  );
};
