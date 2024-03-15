import mongoose from "mongoose";
// import { IProduct } from "../interfaces/product";

const typeProductSchema = new mongoose.Schema<any>(
  {
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true }, // định lượng
    image: { type: String, required: true },
    weight: { type: String, required: true },
    price: { type: Number, required: true },
    idPro: { type: Object, required: true },
    ExistsInStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const TypeProductModel = mongoose.model<any>("TypeProduct", typeProductSchema);
export default TypeProductModel;
