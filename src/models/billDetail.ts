import mongoose from "mongoose";

const BillDetailSchema = new mongoose.Schema<any>(
  {
    idbill: {
      type: Object,
    },
    iduser: {
      type: String,
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
const BillDetailModel = mongoose.model<any>("BillDetail", BillDetailSchema);
export default BillDetailModel;
