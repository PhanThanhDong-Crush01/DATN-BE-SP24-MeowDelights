import mongoose, { Schema } from "mongoose";
const cartSchema: Schema<any> = new mongoose.Schema({
  timestamps: true,
  versionKey: false,
});
export default mongoose.model("Cart", cartSchema);
