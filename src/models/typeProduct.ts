import mongoose from "mongoose";
// import { IProduct } from "../interfaces/product";

const typeProductSchema = new mongoose.Schema<any>(
  {},
  { timestamps: true, versionKey: false }
);

const TypeProductModel = mongoose.model<any>("TypeProduct", typeProductSchema);
export default TypeProductModel;
