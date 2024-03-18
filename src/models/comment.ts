import mongoose from "mongoose";

const commentSchema = new mongoose.Schema<any>(
  {
    productId: {
      type: String,
      required: true,
    },
    productTypeId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      ref: "user",
    },
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    ExistsInStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const CommentModel = mongoose.model<any>("Comment", commentSchema);
export default CommentModel;
