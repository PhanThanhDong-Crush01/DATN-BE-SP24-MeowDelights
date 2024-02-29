import mongoose from "mongoose";

const ChangeBillHistory = new mongoose.Schema<any>(
  {
    idBill: {
      type: String,
    },
    idStaff: {
      type: String,
    },
    statusOrder: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const ChangeBillHistoryModel = mongoose.model<any>(
  "ChangeBillHistory",
  ChangeBillHistory
);
export default ChangeBillHistoryModel;
