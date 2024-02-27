import mongoose from "mongoose";
const myVoucherSchema = new mongoose.Schema<any>(
  {
    idVoucher: { type: String, required: true },
    idUser: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

const MyVoucherModel = mongoose.model<any>("MyVoucher", myVoucherSchema);
export default MyVoucherModel;
