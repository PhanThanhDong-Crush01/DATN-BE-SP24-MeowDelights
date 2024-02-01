import mongoose from "mongoose";
const TypeVoucherSchema = new mongoose.Schema<any>(
  { name: String },
  { timestamps: true, versionKey: false }
);

const TypeVoucherModel = mongoose.model<any>("TypeVoucher", TypeVoucherSchema);
export default TypeVoucherModel;
