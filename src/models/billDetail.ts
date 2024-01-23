import mongoose, { Schema } from "mongoose";
const billDetailSchema: Schema<any> = new mongoose.Schema({
  timestamps: true,
  versionKey: false,
});
export default mongoose.model("BillDetail", billDetailSchema);
