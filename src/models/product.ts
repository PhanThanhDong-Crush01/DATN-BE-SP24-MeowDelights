// models/product.ts
import mongoose, { Document, Model, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IProduct } from "../interface/IProduct";

interface IProductModel extends PaginateModel<IProduct & Document> {}

const productSchema = new mongoose.Schema<IProduct>(
  {},
  { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);

const ProductModel: IProductModel = mongoose.model<IProduct, IProductModel>(
  "Product",
  productSchema
);

export default ProductModel;
