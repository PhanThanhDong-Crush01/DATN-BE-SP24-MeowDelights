import mongoose from "mongoose";

const OrderDetailSchema = new mongoose.Schema<any>(
  {
    idbill: {
      type: Object,
    },
    iduser: {
      type: Object,
    },
    idpro: {
      type: Object,
      required: true,
    },
    idprotype: {
      type: Object,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    money: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const OrderDetailModel = mongoose.model<any>("OrderDetail", OrderDetailSchema);
export default OrderDetailModel;
