import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      defaultValue: "UnCategorized",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const CategoryModel = mongoose.model<any>("Category", categorySchema);
export default CategoryModel;
//category name 1: Phụ kiện mèo
//category name 2: Đồ ăn mèo
