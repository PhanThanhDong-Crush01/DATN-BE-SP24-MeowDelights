import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {},
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Category", categorySchema);
