import { sendError } from "../utils/responseFormatter.js";

/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // Production error response
  if (err.isOperational) {
    return sendError(res, err.statusCode, err.message);
  }

  // Programming or other unknown error: don't leak error details
  console.error("ERROR 💥", err);
  return sendError(res, 500, "Something went very wrong!");
};

export default errorMiddleware;
