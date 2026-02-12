import * as authRepository from "./auth.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../shared/utils/jwt.util.js";

/**
 * Service for business logic related to Authentication
 */

export const register = async (userData) => {
  const existingUser = await authRepository.findByEmailWithPassword(
    userData.email,
  );
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const user = await authRepository.createUser(userData);

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, accessToken, refreshToken };
};

export const login = async (email, password) => {
  const user = await authRepository.findByEmailWithPassword(email);
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, accessToken, refreshToken };
};

export const refresh = async (token) => {
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await authRepository.findById(decoded.id);
  if (!user) {
    throw new Error("User no longer exists");
  }

  const accessToken = generateAccessToken(user._id);
  return { accessToken };
};
