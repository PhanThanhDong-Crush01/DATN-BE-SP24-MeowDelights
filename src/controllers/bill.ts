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
export const getOneBill = async (req, res) => {
  try {
    const idBill = req.params.id;

    const data = await Bill.findById(idBill);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn",
      });
    }
    //data._id là _id của BILL
    const billDetailData = await BillDetailModel.find({
      idbill: data._id,
    });

    return res.status(200).json({
      message: "Tìm kiếm hóa đơn thành công!",
      bill: data,
      billDetails: billDetailData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const Change_PaymentStatus = async (req, res) => {
  try {
    const idBill = req.params.id;
    //req.body: {
    //   paymentstatus: "Đã thanh toán",
    //}

    const data = await Bill.findByIdAndUpdate(idBill, req.body, { new: true });
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không thể thay đổi trạng thái thanh toán hóa đơn",
      });
    }

    return res.status(200).json({
      message: "Thay đổi trạng thái thanh toán của hóa đơn thành công!",
      bill: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//orderstatus có những trạng thái: Chờ xác nhận, Đang chuẩn bị hàng, Đã giao hàng cho đơn vị vận chuyển, Đã giao hàng thành công, Đã hủy hàng
export const Change_OrderStatus = async (req, res) => {
  try {
    const idBill = req.params.id;
    const newOrderStatus = req.body.orderstatus;

    // Lấy đơn hàng hiện tại
    const currentBill = await Bill.findById(idBill);

    // Kiểm tra xem trạng thái mới có phải là trạng thái hợp lệ không
    const validOrderStatuses = [
      "Chờ xác nhận",
      "Đang chuẩn bị hàng",
      "Đã giao hàng cho đơn vị vận chuyển",
      "Đang giao hàng",
      "Đã giao hàng thành công",
      "Đã hủy hàng",
    ];
    const currentIndex = validOrderStatuses.indexOf(currentBill.orderstatus);
    const newIndex = validOrderStatuses.indexOf(newOrderStatus);

    // Kiểm tra xem trạng thái mới có phải là trạng thái liền kề không
    if (
      currentIndex === -1 ||
      newIndex === -1 ||
      newIndex !== currentIndex + 1
    ) {
      return res.status(400).json({
        message:
          "Không thể chuyển đến trạng thái này hoặc trạng thái không hợp lệ.",
      });
    }

    // Cập nhật trạng thái đơn hàng
    const data = await Bill.findByIdAndUpdate(
      idBill,
      { orderstatus: newOrderStatus },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        message: "Không thể thay đổi trạng thái đơn hàng",
      });
    }

    return res.status(200).json({
      message: "Thay đổi trạng thái của đơn hàng thành công!",
      bill: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
