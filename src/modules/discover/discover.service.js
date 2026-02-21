import { getDiscoverUsers } from "./discover.repository.js";

export const discoverService = async (currentUser, page = 1, limit = 10) => {
  if (!currentUser) {
    throw new Error("User not found");
  }

  return await getDiscoverUsers(currentUser, page, limit);
};
