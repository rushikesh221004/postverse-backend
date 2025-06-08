import express from "express";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import { createContent, deleteContent, getAllContent, getContentById, updateContent } from "../controllers/Content.controller.js";
import validate from "../middlewares/Validation.middleware.js";
import { createContentValidator } from "../validators/Content.validator.js";
import { upload } from "../middlewares/multer.middleware.js";

const contentRoutes = express.Router();

contentRoutes
  .route("/create-content")
  .post(
    isLoggedIn,
    upload.single("img"),
    createContentValidator(),
    validate,
    createContent
  );

contentRoutes.route("/update-content/:id").put(
  isLoggedIn,
  upload.single("img"),
  updateContent
);

contentRoutes.route("/get-all-contents").get(isLoggedIn, getAllContent)

contentRoutes.route("/get-content/:id").get(isLoggedIn, getContentById)

contentRoutes.route("/delete-content/:id").delete(isLoggedIn, deleteContent)

export default contentRoutes;
