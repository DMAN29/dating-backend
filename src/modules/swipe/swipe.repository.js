import Swipe from "./swipe.model.js";

// Create swipe
export const createSwipe = async (data) => {
  return await Swipe.create(data);
};

// Find reverse ACCEPT swipe (for match check)
export const findReverseAcceptSwipe = async (fromUser, toUser) => {
  return await Swipe.findOne({
    fromUser,
    toUser,
    action: "accept",
  });
};

// Get all swiped user IDs (for discover exclusion)
export const findSwipedUserIds = async (userId) => {
  const swipes = await Swipe.find({ fromUser: userId }).select("toUser");
  return swipes.map((s) => s.toUser);
};
