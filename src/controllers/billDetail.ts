import AuthModel from "../models/auth";
import { OrderDetailModel } from "../models/bill";

import TypeProductModel from "../models/typeProduct";

export const addBillDetail = async (
  req: any,
  res: any,
  BillDetailData: any
) => {
  try {
    const billdetail = await OrderDetailModel.create(BillDetailData);
    if (!billdetail) {
      return res.status(500).json({
        message: "Thêm hóa đơn chi tiết thất bại",
      });
    }
    const productType: any = await TypeProductModel.findById(
      BillDetailData.idprotype
    );
    const productInStock = productType.quantity;
    if (billdetail.quantity > productInStock) {
      return res.status(400).json({
        message: "Số lượng yêu cầu vượt quá số lượng có sẵn",
      });
    }
    const truSoLuongSP = productType?._doc?.quantity - BillDetailData.quantity;
    const updateQuantity = await TypeProductModel.findByIdAndUpdate(
      productType._id.toString(),
      { quantity: truSoLuongSP },
      { new: true }
    );
    return true;
  } catch (error) {
    console.error(`Error in create bill detail: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
