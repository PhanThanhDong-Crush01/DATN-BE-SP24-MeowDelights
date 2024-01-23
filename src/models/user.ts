import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user";
const userSchema: Schema<IUser> = new mongoose.Schema({
  timestamps: true,
  versionKey: false,
});
export default mongoose.model("User", userSchema);
