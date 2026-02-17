import { verifyToken } from "../utils/jwt.util.js";
import { sendError } from "../utils/responseFormatter.js";
import { findById } from "../../modules/auth/auth.repository.js";
import { ACCOUNT_STATUS } from "../constants/user.constants.js";

/**
 * Middleware to protect routes and validate JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return sendError(res, 401, "Not authorized to access this route");
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError(res, 401, "Token is invalid or expired");
    }

    const user = await findById(decoded.id);
    if (!user) {
      return sendError(res, 401, "User no longer exists");
    }

    if (user.status.isBlocked || user.status.state === ACCOUNT_STATUS.INACTIVE) {
      return sendError(res, 403, "Your account is not active");
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, "Not authorized to access this route");
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `User role ${req.user.role} is not authorized to access this route`,
      );
    }
    next();
  };
};
