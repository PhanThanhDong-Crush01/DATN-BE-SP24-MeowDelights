import BillDetailSchema from "../validation/bill";
import OrderDetailModel from "../models/billdetail";
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
    return true;
  } catch (error) {
    console.error(`Error in create bill detail: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
