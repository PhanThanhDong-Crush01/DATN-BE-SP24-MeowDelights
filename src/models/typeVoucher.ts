import mongoose from "mongoose";
const TypeVoucherSchema = new mongoose.Schema<any>(
  {
    name: {
      type: String,
    },
    ExistsInStock: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true, versionKey: false }
);

const TypeVoucherModel = mongoose.model<any>("TypeVoucher", TypeVoucherSchema);
export default TypeVoucherModel;
