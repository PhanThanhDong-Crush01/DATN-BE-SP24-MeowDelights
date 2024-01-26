import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    employee: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,

      unique: true, // Ensure email is unique
    },
    password: {
      type: String,
      // required: true,
      // Hash the password before saving to the database
    },

    role: {
      type: String,
      default: "member",
    },
    phone: {
      type: String,

      default: "",
    },
    gender: {
      type: Boolean,
      default: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: "",
    },
    imgUser: {
      type: String,
      default: "",
    },
    discount_points: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

const AuthModel = mongoose.model("Auth", authSchema);
export default AuthModel;
