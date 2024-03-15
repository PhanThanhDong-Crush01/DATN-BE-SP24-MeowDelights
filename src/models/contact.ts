import mongoose from "mongoose";
const ContactSchema = new mongoose.Schema<any>(
  {
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true }, // định lượng
    message: { type: String, required: true },
    idNV: { type: String },
    statusOrder: { type: Boolean },
    idOrder: { type: String },
    note: { type: String },
    ExistsInStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const ContactModel = mongoose.model<any>("Contact", ContactSchema);
export default ContactModel;
