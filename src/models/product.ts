import { IProduct } from "./../interface/IProduct";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { Document, Model, PaginateModel } from "mongoose";

interface IProductModel extends PaginateModel<IProduct & Document> {}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    view: { type: Number },
    star: { type: Number },
    import_date: { type: Date, required: true },
    expiry: { type: String, required: true },
    status: { type: Boolean },
    description: { type: String, required: true },
    idCategory: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);

const ProductModel: IProductModel = mongoose.model<IProduct, IProductModel>(
  "Product",
  productSchema
);
export default ProductModel;
