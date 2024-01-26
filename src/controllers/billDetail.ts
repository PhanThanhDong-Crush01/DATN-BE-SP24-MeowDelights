import BillDetailSchema from "../validation/bill";
import BillDetailModel from "../models/billdetail";
export const addBillDetail = async (
  req: any,
  res: any,
  BillDetailData: any
) => {
  try {
    const { error } = BillDetailSchema.validate(BillDetailData);
    if (error) {
      return res.status(400).json({
        message: `Validation error: ${error.details[0].message}`,
      });
    }

    const billdetail = await BillDetailModel.create(BillDetailData);
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
