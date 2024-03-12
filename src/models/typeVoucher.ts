import mongoose from "mongoose";
const TypeVoucherSchema = new mongoose.Schema<any>(
  {
    name: String,
    ExistsInStock: {
      type: Boolean,
    },
  },

  { timestamps: true, versionKey: false }
);

const TypeVoucherModel = mongoose.model<any>("TypeVoucher", TypeVoucherSchema);
export default TypeVoucherModel;
