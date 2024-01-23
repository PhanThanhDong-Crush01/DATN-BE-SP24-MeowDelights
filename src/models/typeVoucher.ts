import mongoose from "mongoose";
const TypeVoucherSchema = new mongoose.Schema<any>(
  { name: String },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<any>("TypeVoucher", TypeVoucherSchema);
