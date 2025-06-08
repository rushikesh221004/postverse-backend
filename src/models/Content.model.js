import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    }
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);

export default Content;
