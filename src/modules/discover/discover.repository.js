import User from "../user/user.model.js";
import Swipe from "../swipe/swipe.model.js";
import Match from "../match/match.model.js";

export const getDiscoverUsers = async (currentUser, limit = 20) => {
  const userId = currentUser._id;

  // Get swiped users
  const swipes = await Swipe.find({ fromUser: userId }).select("toUser");
  const swipedIds = swipes.map((s) => s.toUser);

  // Get matched users
  const matches = await Match.find({
    users: userId,
    isDeleted: { $ne: true },
  }).select("users");

  const matchedIds = matches.flatMap((m) =>
    m.users.filter((id) => id.toString() !== userId.toString()),
  );

  const excludedIds = [userId, ...swipedIds, ...matchedIds];

  const { interestedIn, ageRange, maxDistance } = currentUser.preference;

  const query = {
    _id: { $nin: excludedIds },
    isDeleted: { $ne: true },
    "status.state": "active",
    "status.isBlocked": { $ne: true },
  };

  // Gender filter
  if (interestedIn !== "both") {
    query.gender = interestedIn;
  }

  // Age filter
  if (ageRange) {
    const today = new Date();
    const minDOB = new Date(
      today.getFullYear() - ageRange.max,
      today.getMonth(),
      today.getDate(),
    );
    const maxDOB = new Date(
      today.getFullYear() - ageRange.min,
      today.getMonth(),
      today.getDate(),
    );

    query.dateOfBirth = { $gte: minDOB, $lte: maxDOB };
  }

  // Geo filter (if coordinates exist)
  if (
    currentUser.location?.coordinates?.coordinates &&
    currentUser.location.coordinates.coordinates.length === 2
  ) {
    query["location.coordinates"] = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: currentUser.location.coordinates.coordinates,
        },
        $maxDistance: maxDistance * 1000, // km to meters
      },
    };
  }

  return await User.find(query)
    .select("firstName lastName profilePhotos bio gender dateOfBirth location")
    .limit(limit);
};
