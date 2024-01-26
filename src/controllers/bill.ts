import Bill from "../models/Bill";
import BillModel from "../models/Bill";
import BillDetailModel from "../models/billdetail";
import { BillSchema } from "../validation/bill";
import { addBillDetail } from "./billDetail";

export const createBill = async (req: any, res: any) => {
  try {
    const { error } = BillSchema.validate(req.body.bill);
    if (error) {
      return res.status(400).json({
        messageErrorBill: error.details[0].message,
      });
    }

    const bill = await BillModel.create(req.body.bill);
    if (!bill) {
      return res.json({
        message: "Thêm hóa đơn thất bại",
      });
    }
    const idbill = bill._id;
    const billdetails = req.body.billdetail;
    for (const TypeBillDetail of billdetails) {
      const newBillDetail = { ...TypeBillDetail, idbill };
      try {
        console.log(newBillDetail);
        await addBillDetail(req, res, newBillDetail);
      } catch (error) {
        console.error(`Error in addBillDetail: ${error.message}`);
      }
    }
    const BillDetailData = await BillDetailModel.find({ idbill: idbill });

    return res.json({
      message: "Thêm hóa đơn và hóa đơn chi tiết thành công",
      data: {
        bill,
        billdetails: BillDetailData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getAllBill = async (req, res) => {
  try {
    // const { data } = await axios.get(`${API_URL}/typeVoucher`);
    const data = await Bill.find();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách hóa đơn",
      });
    }

    return res.status(200).json({
      message: "Gọi danh sách hóa đơn thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
