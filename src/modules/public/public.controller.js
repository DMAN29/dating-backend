import { PUBLIC_CONSTANTS } from "../../shared/constants/public.constants.js";
import { sendSuccess } from "../../shared/utils/responseFormatter.js";

export const getPublicConstantsController = async (req, res) => {
  return sendSuccess(
    res,
    200,
    "Public constants fetched successfully",
    PUBLIC_CONSTANTS,
  );
};
