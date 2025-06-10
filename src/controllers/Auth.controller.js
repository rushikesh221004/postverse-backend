import Auth from "../models/Auth.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import generateAccessAndRefreshToken from "../utils/generateRefAndAccToken.util.js";
import Content from "../models/Content.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Set to true in production
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await Auth.findOne({ email });

  if (existingUser) {
    return res
      .status(409)
      .json(new ApiError(409, "User already exists with this email"));
  }

  const newUser = await Auth.create({
    fullName,
    email,
    password,
  });

  return res.status(201).json(
    new ApiResponse(201, {
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        contents: newUser.contents,
      },
    })
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await Auth.findOne({ email });

  if (!existingUser) {
    return res.status(401).json(new ApiError(401, "Invalid credentials"));
  }

  const isPasswordValid = await existingUser.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existingUser._id
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);

  return res.status(200).json(
    new ApiResponse(200, "User logged in successfully", {
      refreshToken,
      user: {
        _id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
      },
    })
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const userProfile = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const userDetails = await Auth.findById(id);

  if (!userDetails) {
    return res
      .status(401)
      .json(
        new ApiError(
          401,
          "Unauthorized. User not found. Please register or log in."
        )
      );
  }

  const findAllContents = await Content.find({ createdBy: id });

  if (findAllContents.length === 0) {
    return res
      .status(404)
      .json(new ApiError(404, "No content found for this user."));
  }

  return res.status(200).json(new ApiResponse(200, {
    fullName: userDetails.fullName,
    contents: findAllContents.length
  }))
});

export { registerUser, loginUser, logoutUser, userProfile };
