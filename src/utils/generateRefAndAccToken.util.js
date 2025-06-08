import Auth from "../models/Auth.model.js";
import { ApiError } from "./apiError.util.js";

async function generateAccessAndRefreshToken(userId) {
  try {
    const user = await Auth.findById(userId);
    if (!user) {
      return new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error generating tokens:", error);
    throw new ApiError(500, "Internal Server Error", error.message);
  }
}

export default generateAccessAndRefreshToken;
