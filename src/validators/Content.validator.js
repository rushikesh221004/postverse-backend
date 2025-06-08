import { body } from "express-validator";

const createContentValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ];
};

export { createContentValidator };
