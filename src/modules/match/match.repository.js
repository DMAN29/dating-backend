import Match from "./match.model.js";

// Create match safely (used in swipe service)
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

// Find match between two users
export const findMatchBetweenUsers = async (userA, userB) => {
  const sortedUsers = [userA, userB].map((id) => id.toString()).sort();

  return await Match.findOne({
    users: sortedUsers,
    isDeleted: { $ne: true },
  });
};

// Get all matches of a user
export const findMatchesByUser = async (userId) => {
  return await Match.find({
    users: userId,
    isDeleted: { $ne: true },
  })
    .populate("users", "firstName lastName profilePhotos bio")
    .sort({ matchedAt: -1 });
};

// Soft delete match
export const softDeleteMatch = async (matchId) => {
  return await Match.findByIdAndUpdate(
    matchId,
    { isDeleted: true },
    { new: true },
  );
};
