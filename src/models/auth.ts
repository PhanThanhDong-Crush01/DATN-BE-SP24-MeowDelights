// import { boolean } from "joi";
// import mongoose from "mongoose";

// const authSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//     },
//     email: {
//       type: String,
//       // required: true,
//     },
//     password: {
//       type: String,
//     },
//     role: {
//       type: String,
//       default: "member",
//     },
//     phone: {
//       type: String,
//       default: "",
//     },
//     gender: {
//       type: Boolean,
//       default: true,
//     },
//     age: {
//       type: Number,
//       default: 0,
//     },
//     address: {
//       type: String,
//       default: "",
//     },
//     imgUser: {
//       type: String,
//       default: "",
//     },
//     authorized_accounts: {
//       type: String,
//     },
//   },
//   { timestamps: true, versionKey: false }
// );

// const AuthModel = mongoose.model("Auth", authSchema);
// export default AuthModel;
import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
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
    },
    gender: {
      type: Boolean,
    },
    age: {
      type: Number,
    },
    address: {
      type: String,
    },
    imgUser: {
      type: String,
    },
    discount_points: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    jobPosition: {
      type: String,
    },
    employee: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const AuthModel = mongoose.model("Auth", authSchema);
export default AuthModel;
