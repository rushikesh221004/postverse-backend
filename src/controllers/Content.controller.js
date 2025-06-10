import { ApiError } from "../utils/apiError.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import Content from "../models/Content.model.js";
import Auth from "../models/Auth.model.js";

const createContent = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const imgLocalPath = req.file?.path;

  if (!imgLocalPath) {
    return res.status(400).json(new ApiError(400, "Image is required"));
  }

  const img = await uploadOnCloudinary(imgLocalPath);

  if (!img) {
    return res.status(500).json(new ApiError(500, "Failed to upload image"));
  }

  const autherName = await Auth.findById(req.user.id);

  const content = await Content.create({
    img: img.url,
    title,
    description,
    createdBy: req.user.id,
    auther: autherName.fullName,
  });

  //   console.log("User id", req.user)

  if (!content) {
    return res.status(500).json(new ApiError(500, "Failed to create content"));
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        content: {
          _id: content._id,
          img: content.img,
          title: content.title,
          description: content.description,
          createdBy: content.createdBy,
          auther: content.auther,
        },
      },
      "Content created successfully"
    )
  );
});

const updateContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const content = await Content.findById(id);
  if (!content) {
    return res.status(404).json(new ApiError(404, "Content not found"));
  }

  const imgLocalPath = req.file?.path;

  const img = await uploadOnCloudinary(imgLocalPath);

  content.title = title || content.title;
  content.description = description || content.description;
  content.img = img?.url || content.img;

  const updatedContent = await content.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        content: {
          _id: updatedContent._id,
          img: updatedContent.img,
          title: updatedContent.title,
          description: updatedContent.description,
          createdBy: updatedContent.createdBy,
        },
      },
      "Content updated successfully"
    )
  );
});

const deleteContent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Content.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Content deleted successfully"));
});

const getAllContent = asyncHandler(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    return res
      .status(401)
      .json(
        new ApiError(
          401,
          "You are not logged in. Please log in to access this resource."
        )
      );
  }
  const allContent = await Content.find();
  if (!allContent || allContent.length === 0) {
    return res.status(404).json(new ApiError(404, "No content found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allContent, "All content fetched successfully"));
});

const getContentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const content = await Content.findById(id);
  if (!content) {
    return res.status(404).json(new ApiError(404, "Content not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, content, "Content fetched successfully"));
});

const getContentAllContentsCreatedByUser = asyncHandler(async (req, res) => {
  const id = req.user.id;

  if (!id) {
    return res
      .status(401)
      .json(
        new ApiError(
          401,
          "You are not logged in. Please log in to access this resource."
        )
      );
  }

  const findAllContents = await Content.find({ createdBy: id });

  if (findAllContents.length === 0) {
    return res
      .status(404)
      .json(new ApiError(404, "No content found for this user."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        findAllContents,
        "User's created contents fetched successfully."
      )
    );
});

export {
  createContent,
  updateContent,
  deleteContent,
  getAllContent,
  getContentById,
  getContentAllContentsCreatedByUser,
};
