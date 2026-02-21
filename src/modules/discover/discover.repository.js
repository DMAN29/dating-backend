import { findDiscoverUsersPaginated } from "../user/user.repository.js";
import { findSwipedUserIds } from "../swipe/swipe.repository.js";
import { findMatchedUserIds } from "../match/match.repository.js";
import { paginate } from "../../shared/utils/pagination.js";
import {
  GENDERS,
  INTEREST_PREFERENCES,
} from "../../shared/constants/user.constants.js";

export const getDiscoverUsers = async (currentUser, page = 1, limit = 10) => {
  const userId = currentUser._id;

  // 🔹 1️⃣ Get users already swiped by current user
  const swipedIds = await findSwipedUserIds(userId);

  // 🔹 2️⃣ Get matched users
  const matchedIds = await findMatchedUserIds(userId);

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
  // 🔹 4️⃣ City Filter (if current user has a city)
  if (currentUser.location?.city) {
    query["location.city"] = currentUser.location.city;
  }

  // 🔹 5️⃣ Age Filter
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
  // 🔹 6️⃣ Geo / Distance Filter
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
  // 🔹 7️⃣ Pagination
  // ======================================================

  return findDiscoverUsersPaginated(query, page, limit);
};
