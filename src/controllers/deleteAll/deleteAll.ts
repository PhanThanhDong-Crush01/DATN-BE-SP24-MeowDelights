import AuthModel from "../../models/auth";
import BillModel from "../../models/bill";
import OrderDetailModel from "../../models/billdetail";
import CategoryModel from "../../models/category";
import ProductModel from "../../models/product";
import TypeProductModel from "../../models/typeProduct";
import TypeVoucherModel from "../../models/typeVoucher";
import VoucherModel from "../../models/voucher";

export const deleteAllData = async (req: any, res: any) => {
  try {
    // await ProductModel.deleteMany();
    // await TypeProductModel.deleteMany();
    // await CategoryModel.deleteMany();
    // await VoucherModel.deleteMany();
    // await TypeVoucherModel.deleteMany();
    // await AuthModel.deleteMany();
    await BillModel.deleteMany();
    await OrderDetailModel.deleteMany();

    return res.status(200).json({
      message: "Xoá tất cả dữ liệu thành công thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
