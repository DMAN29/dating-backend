import { sendError } from "../utils/responseFormatter.js";

/**
 * Middleware to block access if onboarding is incomplete
 */
export const requireOnboarding = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 401, "Unauthorized");
  }

  if (!req.user.isOnboarded) {
    return sendError(
      res,
      403,
      "Please complete onboarding before accessing this feature",
    );
  }

  next();
};
