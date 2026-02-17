import User from "../user/user.model.js";
import Swipe from "../swipe/swipe.model.js";
import Match from "../match/match.model.js";
import { paginate } from "../../shared/utils/pagination.js";

export const getDiscoverUsers = async (currentUser, page = 1, limit = 20) => {
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
    role: "user",
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

  // Geo filter (only if coordinates exist and are not [0, 0])
  if (
    currentUser.location?.coordinates?.coordinates &&
    currentUser.location.coordinates.coordinates.length === 2 &&
    !(
      currentUser.location.coordinates.coordinates[0] === 0 &&
      currentUser.location.coordinates.coordinates[1] === 0
    )
  ) {
    const maxDistanceKm = maxDistance || 50;
    const earthRadiusMeters = 6378137;
    const maxDistanceRadians = (maxDistanceKm * 1000) / earthRadiusMeters;

    query["location.coordinates"] = {
      $geoWithin: {
        $centerSphere: [
          currentUser.location.coordinates.coordinates,
          maxDistanceRadians,
        ],
      },
    };
  }

  return paginate({
    model: User,
    filter: query,
    projection:
      "firstName lastName profilePhotos bio gender dateOfBirth location",
    page,
    limit,
  });
};
