import User from "../user/user.model.js";
import Swipe from "../swipe/swipe.model.js";
import Match from "../match/match.model.js";
import { paginate } from "../../shared/utils/pagination.js";
import {
  GENDERS,
  INTEREST_PREFERENCES,
} from "../../shared/constants/user.constants.js";

export const getDiscoverUsers = async (currentUser, page = 1, limit = 10) => {
  const userId = currentUser._id;

  // 🔹 1️⃣ Get users already swiped by current user
  const swipes = await Swipe.find({ fromUser: userId }).select("toUser");
  const swipedIds = swipes.map((s) => s.toUser);

  // 🔹 2️⃣ Get matched users
  const matches = await Match.find({
    users: userId,
    isDeleted: { $ne: true },
  }).select("users");

  const matchedIds = matches.flatMap((m) =>
    m.users.filter((id) => id.toString() !== userId.toString()),
  );

  const excludedIds = [userId, ...swipedIds, ...matchedIds];

  const { interestedIn, ageRange, maxDistance } = currentUser.preference || {};

  const currentGender = currentUser.gender;

  // 🔹 3️⃣ Base query
  const query = {
    _id: { $nin: excludedIds },
    isDeleted: { $ne: true },
    "status.state": "active",
    "status.isBlocked": { $ne: true },
    role: "user",
  };

  // ======================================================
  // ✅ UNIVERSAL MUTUAL COMPATIBILITY LOGIC (FIXED)
  // ======================================================

  // Which genders current user wants to see
  const gendersCurrentUserLikes =
    interestedIn === INTEREST_PREFERENCES.BOTH
      ? [GENDERS.MALE, GENDERS.FEMALE]
      : [interestedIn];

  // Candidate must be one of those genders
  query.gender = { $in: gendersCurrentUserLikes };

  // Candidate must also like current user's gender
  query["preference.interestedIn"] = {
    $in: [currentGender, INTEREST_PREFERENCES.BOTH],
  };

  // ======================================================
  // 🔹 4️⃣ Age Filter
  // ======================================================

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

    query.dateOfBirth = {
      $gte: minDOB,
      $lte: maxDOB,
    };
  }

  // ======================================================
  // 🔹 5️⃣ Geo Filter
  // ======================================================

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

  // ======================================================
  // 🔹 6️⃣ Pagination
  // ======================================================

  return paginate({
    model: User,
    filter: query,
    projection:
      "firstName lastName profilePhotos bio gender dateOfBirth location",
    page,
    limit,
  });
};
