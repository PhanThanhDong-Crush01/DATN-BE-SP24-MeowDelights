import mongoose, { Schema } from "mongoose";
const billSchema: Schema<any> = new mongoose.Schema({
  timestamps: true,
  versionKey: false,
});
export default mongoose.model("Bill", billSchema);
