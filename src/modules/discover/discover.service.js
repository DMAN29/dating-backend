import User from "../user/user.model.js";
import { getDiscoverUsers } from "./discover.repository.js";

export const discoverService = async (userId, page = 1, limit = 10) => {
  const currentUser = await User.findById(userId);

  if (!currentUser) {
    throw new Error("User not found");
  }

  if (!currentUser.profileComplete) {
    throw new Error("Complete your profile to start discovering users");
  }

  return await getDiscoverUsers(currentUser, page, limit);
};
