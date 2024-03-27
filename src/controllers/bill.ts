import WhyCancelOrderModel from "../models/WhyCancelOrder";
import AuthModel from "../models/auth";
import BillModel, { OrderDetailModel } from "../models/bill";
import CategoryModel from "../models/category";
import ChangeBillHistoryModel from "../models/changeBillHistory";
import ProductModel from "../models/product";
import TypeProductModel from "../models/typeProduct";
import VoucherModel from "../models/voucher";
import { addBillDetail } from "./billDetail";
import moment from "moment"; // Import thư viện moment để làm việc với thời gian

import { decreaseVoucherQuantity } from "./voucher";
// xong bill
export const createBill = async (req: any, res: any) => {
  try {
    if (req.body.bill.idvc != "") {
      const voucher: any = await VoucherModel.findById(req.body.bill.idvc);
      if (voucher?.quantity === 0) {
        return res.status(500).json({
          message: "Áp dụng voucher không thành công!!!",
        });
      }
    }
    const bill = await BillModel.create(req.body.bill);
    if (!bill) {
      return res.json({
        message: "Thêm hóa đơn thất bại",
      });
    }

    if (req.body.bill.idvc != "") {
      decreaseVoucherQuantity(req.body.bill.idvc);
    }

    const idbill = bill._id;
    const iduser = bill.iduser;
    await OrderDetailModel.deleteMany({ iduser: iduser });
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

    const changeBillHistory = {
      idBill: idbill,
      statusOrder: "Chờ xác nhận",
    };
    const changeOrder = await ChangeBillHistoryModel.create(changeBillHistory);

    return res.json({
      message: "Thêm hóa đơn và hóa đơn chi tiết thành công",
      data: {
        bill,
        billdetails: BillDetailData,
        changeOrder,
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
    const data = await BillModel.find({ ExistsInStock: true });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách hóa đơn",
      });
    }

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

        let voucher: any = "";
        if (item.idvc != "") {
          voucher = await VoucherModel.findById(item.idvc);
          console.log("🚀 ~ data.map ~ voucher:", voucher);
          console.log("🚀 ~ data.map ~ item.idvc:", item.idvc);
        }

        return {
          _id: item._id,
          iduser: item.iduser,
          nameUser: item.nameUser,
          email: item.email,
          money: item.money,
          // totalQuantity: totalQuantity,
          date: item.date,
          address: item.address,
          tel: item.tel,
          idvc: item.idvc,
          nameVc: item.nameVc,
          decreaseVc: item.decreaseVc,
          paymentmethods: item.paymentmethods,
          paymentstatus: item.paymentstatus,
          orderstatus: item.orderstatus,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          // voucher: voucher,
          // ExistsInStock: true,
          user: {
            name: user?._doc?.name,
            email: user?._doc?.email,
          },
        };
      })
    );

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

    const data = await BillModel.findById(idBill, req.body);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn",
      });
    }

    const billDetailData = await OrderDetailModel.find({
      idbill: data._id,
    });
    const billDetail = await Promise.all(
      billDetailData.map(async (item) => {
        const product = await ProductModel.findById(item?._doc.idpro);

        const type_product = await TypeProductModel.findById(
          item?._doc.idprotype
        );

        return {
          ...item._doc,
          product: product,
          type_product: type_product,
        };
      })
    );

    const billChangeStatusOrderHistoryData = await ChangeBillHistoryModel.find({
      idBill: data._id,
    });

    const billChangeStatusOrderHistory = await Promise.all(
      billChangeStatusOrderHistoryData.map(async (item: any) => {
        if (item?._doc?.idStaff) {
          const staff: any = await AuthModel.findById(item?._doc?.idStaff);
          const user = staff._doc ? staff._doc : "";
          return {
            changeStatusOrder: { ...item?._doc, staff: user },
          };
        }
        return {
          changeStatusOrder: item?._doc,
        };
      })
    );

    return res.status(200).json({
      message: "Tìm kiếm hóa đơn thành công!",
      bill: data?._doc,
      billDetails: billDetailData,
      billChangeStatusOrderHistory,
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

    const data = await BillModel.find({ iduser: iduser }, req.body);
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
        // Tính tổng số lượng sản phẩm trong hóa đơn
        const totalQuantity = billDetails.reduce(
          (total: number, current: any) => {
            return total + current.quantity;
          },
          0
        );

        return {
          _id: item._id,
          iduser: item.iduser,
          money: item.money,
          totalQuantity: totalQuantity,
          date: item.date,
          adress: item.adress,
          tel: item.tel,
          idvc: item.idvc,
          nameVc: item.nameVc,
          decreaseVc: item.decreaseVc,
          paymentmethods: item.paymentmethods,
          paymentstatus: item.paymentstatus,
          orderstatus: item.orderstatus,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,

          voucher: "",
          // user: {
          //   name: user._doc.name,
          //   email: user._doc.email,
          // },
          // products: products,

          ...item?._doc,
          // totalQuantity: totalQuantity,
          billDetails,
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
    const newPaymentStatus = req.body.paymentstatus;

    const data = await BillModel.findByIdAndUpdate(
      idBill,
      { paymentstatus: newPaymentStatus },
      {
        new: true,
      }
    );
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
    const bilbillbill = await BillModel.findById(idBill);
    if (bilbillbill?.orderstatus == "Đã hủy hàng") {
      return res.status(500).json({
        message: "Không thể thay đổi trạng thái đơn hàng cho đơn đã hủy!",
      });
    }
    const newOrderStatus = req.body.orderstatus;

    const idStaff = req.body.idStaff;

    // Kiểm tra xem trạng thái mới có phải là trạng thái hợp lệ không
    const validOrderStatuses = [
      "Chờ xác nhận",
      "Đang chuẩn bị hàng",
      "Đã giao hàng cho đơn vị vận chuyển",
      "Đang giao hàng",
      "Đã giao hàng thành công",
    ];

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

    const changeBillHistory = {
      idBill: idBill,
      idStaff: idStaff,
      statusOrder: newOrderStatus,
    };
    const changeOrder = await ChangeBillHistoryModel.create(changeBillHistory);
    if (!data) {
      return res.status(404).json({
        message: "Không thể lưu lịch sử thay đổi trạng thái!",
      });
    }
    return res.status(200).json({
      message: "Thay đổi trạng thái của đơn hàng thành công!",
      bill: data,
      changeOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const increaseProductQuantity = async (idprotype, quantity) => {
  try {
    // Tìm sản phẩm trong kho dựa trên idprotype và tăng số lượng
    const product = await TypeProductModel.findOneAndUpdate(
      { _id: idprotype },
      { $inc: { quantity } }, // Tăng số lượng sản phẩm trong kho
      { new: true } // Trả về bản ghi đã cập nhật
    );

    if (!product) {
      console.log("Không tìm thấy sản phẩm để cập nhật số lượng");
      // Xử lý trường hợp không tìm thấy sản phẩm trong kho
    }

    return product; // Trả về sản phẩm đã được cập nhật số lượng
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật số lượng sản phẩm trong kho:",
      error.message
    );
    // Xử lý lỗi khi cập nhật số lượng sản phẩm trong kho
    throw error;
  }
};

//nv huy hang
export const CancelOrder = async (req, res) => {
  try {
    const idBill = req.params.id;
    const newOrderStatus = "Đã hủy hàng";
    const idStaff = req.body.idStaff;
    // Kiểm tra xem trạng thái mới có phải là trạng thái hợp lệ không
    const bill = await BillModel.findById(idBill);
    if (!bill) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (
      bill.orderstatus !== "Chờ xác nhận" &&
      bill.orderstatus !== "Đang chuẩn bị hàng"
    ) {
      return res.status(400).json({
        message: "Không thể hủy đơn hàng với trạng thái hiện tại",
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
    // Lấy thông tin chi tiết của các sản phẩm trong đơn hàng đã hủy
    const billDetails = await OrderDetailModel.find({ idbill: idBill });

    // Duyệt qua từng sản phẩm và cập nhật số lượng trong kho
    for (const billDetail of billDetails) {
      const { idprotype, quantity } = billDetail;
      await increaseProductQuantity(idprotype, quantity);
    }

    const changeBillHistory = {
      idBill: idBill,
      idStaff: idStaff,
      statusOrder: newOrderStatus,
    };
    const changeOrder = await ChangeBillHistoryModel.create(changeBillHistory);
    if (!data) {
      return res.status(404).json({
        message: "Không thể hủy đơn hàng!",
      });
    }

    await WhyCancelOrderModel.create({
      message: "Đơn hàng bị hủy bởi nhân viên quản lý - kiểm tra đơn hàng",
      ExistsInStock: true,
      iduser: idStaff,
      idbill: idBill,
    });

    return res.status(200).json({
      message: "Hủy đơn hàng thành công!",
      bill: data,
      changeOrder,
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
export const removeBill = async (req, res) => {
  try {
    const data = await BillModel.findByIdAndUpdate(
      req.params.id,
      { ExistsInStock: false },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        message: "Xóa khuyến mại thất bại",
      });
    }
    return res.status(200).json({
      message: "Xóa khuyến mại thành công",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const checkCan3Order = async (id) => {
  try {
    const userId = id;
    const AllBillUser = await BillModel.find({ iduser: userId });
    // Lọc các đơn hàng có trạng thái 'Đã hủy hàng' trong 30 ngày trước tính từ ngày hiện tại
    const thirtyDaysAgo = moment().subtract(30, "days");
    const cancelledOrders = AllBillUser.filter((order) => {
      return (
        order.orderstatus === "Đã hủy hàng" &&
        moment(order.date) >= thirtyDaysAgo
      );
    });

    // Đếm số đơn hàng đã hủy trong khoảng thời gian đó
    const cancelledOrdersCount = cancelledOrders.length;
    let date = moment().add(30, "days").format("DD-MM-YYYY");
    if (cancelledOrdersCount >= 3) {
      const khoaTK = await AuthModel.findByIdAndUpdate(userId, {
        isLocked: false,
        dateIsLockedTrue: date,
      });
    }
    return cancelledOrdersCount >= 3 ? true : false;
  } catch (error) {}
};
