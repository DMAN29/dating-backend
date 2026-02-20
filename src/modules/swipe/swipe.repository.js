import Swipe from "./swipe.model.js";
import { paginate } from "../../shared/utils/pagination.js";

export const createSwipe = async (data) => {
  return await Swipe.create(data);
};

export const findReverseAcceptSwipe = async (fromUser, toUser) => {
  return await Swipe.findOne({
    fromUser,
    toUser,
    action: "accept",
  });
};

export const findSwipedUserIds = async (userId) => {
  const swipes = await Swipe.find({ fromUser: userId }).select("toUser");
  return swipes.map((s) => s.toUser);
};

export const findIncomingAcceptsPaginated = async (
  userId,
  page = 1,
  limit = 10,
) => {
  const swipedIds = await findSwipedUserIds(userId);

  const filter = {
    toUser: userId,
    action: "accept",
    fromUser: { $nin: [userId, ...swipedIds] },
  };

  return paginate({
    model: Swipe,
    filter,
    page,
    limit,
    sort: { createdAt: -1 },
    populate: {
      path: "fromUser",
      select:
        "firstName lastName email gender dateOfBirth profilePhotos location",
    },
  });
};

export const findAllSwipesPaginated = async (page = 1, limit = 10) => {
  return paginate({
    model: Swipe,
    filter: {},
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [
      {
        path: "fromUser",
        select: "firstName lastName email  gender",
      },
      {
        path: "toUser",
        select: "firstName lastName email  gender",
      },
    ],
  });
};
