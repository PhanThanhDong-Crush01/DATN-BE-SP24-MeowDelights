import mongoose, { Schema } from "mongoose";
const cartSchema: Schema<any> = new mongoose.Schema(
  {
    iduser: {
      type: String,
    },

    //Product:
    idpro: {
      type: String,
      // required: true,
    },
    namePro: {
      type: String,
      // required: true,
    },

    //Type Product:
    idprotype: {
      type: String,
      // required: true,
    },
    nameTypePro: {
      type: String, //color - size: Trắng - M
      // required: true,
    },
    imageTypePro: {
      type: String,
      // required: true,
    },
    quantity: {
      type: Number,
      // required: true,
    },
    money: {
      type: Number,
      // required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model("Cart", cartSchema);
