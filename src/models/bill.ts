import { string } from "joi";
import mongoose from "mongoose";

const BillSchema = new mongoose.Schema<any>(
  {
    //người nhận:
    iduser: {
      type: String,
      // require: true,
    },
    nameUser: {
      type: String,
      // require: true,
    },
    email: {
      type: String,
      require: false,
    },
    tel: {
      type: Number,
      // require: true,
    },
    address: {
      type: String,
      required: true,
    },

    //voucher:
    idvc: {
      type: String,
    },
    nameVc: {
      type: String,
    },
    decreaseVc: {
      type: Number,
    },

    //bill
    date: {
      type: Date,
      // required: true,
    },
    money: {
      type: Number,
      // required: true,
    },
    paymentmethods: {
      type: String,
      // required: true,
    },
    paymentstatus: {
      type: String,
      // required: true,
    },
    orderstatus: {
      type: String,
      // required: true,
    },
    ExistsInStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const BillModel = mongoose.model<any>("Bill", BillSchema);
export default BillModel;
//gộp
const OrderDetailSchema = new mongoose.Schema<any>(
  {
    idbill: {
      type: String,
    },
    iduser: {
      type: String,
    },

    //Product:
    idpro: {
      type: String,
      // required: true,
    },
    namePro: {
      type: String,
      // required: true,
    },

    //Type Product:
    idprotype: {
      type: String,
      // required: true,
    },
    nameTypePro: {
      type: String, //color - size: Trắng - M
      // required: true,
    },
    imageTypePro: {
      type: String,
      // required: true,
    },
    quantity: {
      type: Number,
      // required: true,
    },
    money: {
      type: Number,
      // required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const OrderDetailModel = mongoose.model<any>(
  "OrderDetail",
  OrderDetailSchema
);

// Tất cả dữ liệu đều được lưu trữ luôn, tính toán và lưu vào database luôn,
// k được dùng iduser, idvc, idpro, idtypepro,... k dùng mấy id này để find tìm kiếm rồi mới tính toán

// các file cần sửa:

// FE:
// Client: productdetail, cart, PaymentInformationPage, componnet / SendOtp
// admin: list bill, bill detail

// BE: crud bill, crud cart
