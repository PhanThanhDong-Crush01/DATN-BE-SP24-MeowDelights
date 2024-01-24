import mongoose from "mongoose";
// import { IProduct } from "../interfaces/product";

const productSchema = new mongoose.Schema<any>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    import_date: { type: Date, required: true },
    expiry: { type: String, required: true },
    status: { type: Boolean },
    description: { type: String, required: true },
    idCategory: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const ProductModel = mongoose.model<any>("Product", productSchema);
export default ProductModel;
