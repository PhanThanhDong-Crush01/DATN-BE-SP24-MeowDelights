import AuthModel from "../models/auth";
import BillModel from "../models/bill";
import OrderDetailModel from "../models/billdetail";
import CategoryModel from "../models/category";
import VoucherModel from "../models/voucher";
import { addBillDetail } from "./billDetail";

export const createBill = async (req: any, res: any) => {
  try {
    const bill = await BillModel.create(req.body.bill);
    if (!bill) {
      return res.json({
        message: "Thêm hóa đơn thất bại",
      });
    }
    const idbill = bill._id;
    const billdetails = req.body.billdetails;
    for (const TypeBillDetail of billdetails) {
      const newBillDetail = { ...TypeBillDetail, idbill };
      try {
        await addBillDetail(req, res, newBillDetail);
      } catch (error) {
        console.error(`Error in addBillDetail: ${error.message}`);
      }
    }
    const BillDetailData = await OrderDetailModel.find({ idbill: idbill });

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
    const data = await BillModel.find();

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

    const data = await BillModel.findById(idBill);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn",
      });
    }
    //data._id là _id của BILL
    const billDetailData = await OrderDetailModel.find({
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
export const getBillOfUser = async (req, res) => {
  try {
    const iduser = req.params.id;

    const data = await BillModel.find({ iduser: iduser });
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn",
      });
    }
    //data._id là _id của BILL
    const newData = await Promise.all(
      data.map(async (item: any) => {
        const billDetails = await OrderDetailModel.find({
          idbill: item._id,
        });

        // Tính tổng tiền của hóa đơn
        const totalMoney = billDetails.reduce((total: number, current: any) => {
          return total + current.money;
        }, 0);

        // Tính tổng số lượng sản phẩm trong hóa đơn
        const totalQuantity = billDetails.reduce(
          (total: number, current: any) => {
            return total + current.quantity;
          },
          0
        );

        const user: any = await AuthModel.findById(item.iduser);
        if (item.idvc != "") {
          const voucher: any = await VoucherModel.findById(item.idvc);
          console.log("🚀 ~ data.map ~ voucher:", voucher);
        }

        // Trả về thông tin cơ bản của hóa đơn cùng với tổng số lượng và tổng tiền
        return {
          _id: item._id,
          iduser: item.iduser,
          money: totalMoney,
          totalQuantity: totalQuantity,
          date: item.date,
          adress: item.adress,
          tel: item.tel,
          idvc: item.idvc,
          paymentmethods: item.paymentmethods,
          paymentstatus: item.paymentstatus,
          orderstatus: item.orderstatus,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          voucher: "",
          user: {
            name: user._doc.name,
            email: user._doc.email,
          },
        };
      })
    );

    return res.status(200).json({
      message: "Tìm kiếm hóa đơn của bạn thành công!",
      bill: newData,
      //billDetails: billDetailData,
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

    const data = await BillModel.findByIdAndUpdate(idBill, req.body, {
      new: true,
    });
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
    const currentBill = await BillModel.findById(idBill);

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
    const data = await BillModel.findByIdAndUpdate(
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

// export const revenue = async (req: any, res: any) => {
//   try {
//     const currentDate = new Date(); // Ngày hiện tại
//     const startDate = new Date(2024, 0, 1); // Ngày bắt đầu là 1/1/2024
//     const endDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       currentDate.getDate() + 1
//     ); // Ngày kết thúc là ngày hiện tại

//     // Lưu kết quả của các ngày vào mảng
//     const revenueByDate: { date: string; totalRevenue: number }[] = [];

//     // Lặp qua mỗi ngày từ ngày bắt đầu đến ngày kết thúc
//     for (
//       let d = new Date(startDate);
//       d <= endDate;
//       d.setDate(d.getDate() + 1)
//     ) {
//       const currentDate = new Date(d);

//       // Tính tổng doanh thu trong khoảng thời gian
//       const result = await BillModel.aggregate([
//         {
//           $match: {
//             date: {
//               $gte: currentDate,
//               $lt: new Date(
//                 currentDate.getFullYear(),
//                 currentDate.getMonth(),
//                 currentDate.getDate() + 1
//               ),
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             totalRevenue: { $sum: "$money" },
//           },
//         },
//       ]);

//       const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

//       revenueByDate.push({
//         date: currentDate.toISOString().split("T")[0], // Định dạng ngày thành YYYY-MM-DD
//         totalRevenue: totalRevenue,
//       });
//     }

//     return res.status(200).json({
//       revenueByDate: revenueByDate,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const dailyRevenueAndCategorySales = async (req, res) => {
  try {
    // Tính toán ngày bắt đầu là ngày 1/1/2024
    const startDate = new Date(2024, 0, 1);
    console.log("🚀 ~ dailyRevenueAndCategorySales ~ startDate:", startDate);

    // Tính toán ngày kết thúc là ngày hiện tại
    const endDate = new Date();
    console.log("🚀 ~ dailyRevenueAndCategorySales ~ endDate:", endDate);

    // Tính tổng doanh thu trong ngày
    const dailyResult = await BillModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$money" },
        },
      },
    ]);
    console.log(
      "🚀 ~ dailyRevenueAndCategorySales ~ dailyResult:",
      dailyResult
    );

    const dailyRevenue =
      dailyResult.length > 0 ? dailyResult[0].totalRevenue : 0;

    // Lấy danh sách các sản phẩm trong danh mục "Phụ kiện mèo" và "Đồ ăn mèo"
    const accessoriesCategory = await CategoryModel.findOne({
      name: "Phụ kiện mèo",
    });
    const foodCategory = await CategoryModel.findOne({ name: "Đồ ăn mèo" });

    const accessoriesProducts = accessoriesCategory
      ? accessoriesCategory.products
      : [];
    const foodProducts = foodCategory ? foodCategory.products : [];

    // Tính tổng doanh thu của các sản phẩm trong danh mục "Phụ kiện mèo" và "Đồ ăn mèo"
    const accessorySalesResult = await BillModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
          idvc: { $in: accessoriesProducts },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$money" },
        },
      },
    ]);

    const accessorySales =
      accessorySalesResult.length > 0
        ? accessorySalesResult[0].totalRevenue
        : 0;

    const foodSalesResult = await BillModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
          idvc: { $in: foodProducts },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$money" },
        },
      },
    ]);

    const foodSales =
      foodSalesResult.length > 0 ? foodSalesResult[0].totalRevenue : 0;

    return res.status(200).json({
      date: startDate.toISOString().split("T")[0], // Trả về ngày bắt đầu thống kê
      dailyRevenue: dailyRevenue,
      accessorySales: accessorySales,
      foodSales: foodSales,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
