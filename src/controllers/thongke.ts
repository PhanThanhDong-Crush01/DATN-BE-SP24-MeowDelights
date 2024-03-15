import AuthModel from "../models/auth";
import BillModel, { OrderDetailModel } from "../models/bill";
import ProductModel from "../models/product";

export const thong_ke = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let aggregationPipeline: any = [];

    // Nếu chỉ định ngày cụ thể, thống kê sản phẩm bán theo từng giờ
    if (startDate && endDate && startDate === endDate) {
      aggregationPipeline.push(
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          },
        },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            totalQuantity: { $sum: "$quantity" },
          },
        },
        { $sort: { _id: 1 } }
      );
    }
    // Nếu chỉ định khoảng thời gian từ tuần/tháng/năm, thống kê sản phẩm bán theo từng ngày
    else if (startDate && endDate) {
      aggregationPipeline.push(
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          },
        },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" },
            totalQuantity: { $sum: "$quantity" },
          },
        },
        { $sort: { _id: 1 } }
      );
    }
    // Nếu chỉ định năm cụ thể, thống kê sản phẩm bán theo từng tháng
    else if (startDate && !endDate) {
      aggregationPipeline.push(
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(startDate).setMonth(11, 31),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalQuantity: { $sum: "$quantity" },
          },
        },
        { $sort: { _id: 1 } }
      );
    }

    const productSales = await OrderDetailModel.aggregate(aggregationPipeline);

    return res.status(200).json({ productSales });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi thực hiện thống kê: " + error.message,
    });
  }
};
// export const thong_ke = async (req, res) => {
//   try {
//     // Lấy thời điểm bắt đầu và kết thúc của ngày hiện tại
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     // Thống kê doanh số bán hàng trong ngày
//     const totalSales = await BillModel.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfDay, $lte: endOfDay },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: "$money" },
//         },
//       },
//     ]);

//     // Thống kê sản phẩm bán chạy nhất
//     const mostSoldProduct = await OrderDetailModel.aggregate([
//       {
//         $group: {
//           _id: "$idpro",
//           totalQuantity: { $sum: "$quantity" },
//         },
//       },
//       {
//         $sort: { totalQuantity: -1 },
//       },
//       {
//         $limit: 1,
//       },
//     ]);

//     // Tính tỷ lệ chuyển đổi từ số lượng truy cập sản phẩm
//     const totalVisits = await ProductModel.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalVisits: { $sum: "$view" },
//         },
//       },
//     ]);
//     const numOrders = await BillModel.countDocuments();
//     const conversionRate =
//       numOrders > 0 ? (numOrders / totalVisits[0].totalVisits) * 100 : 0;

//     // Thống kê lượng truy cập trang web
//     const totalPageVisits = await ProductModel.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalPageVisits: { $sum: "$view" },
//         },
//       },
//     ]);

//     // Thống kê tổng số đơn hàng
//     const totalOrders = await BillModel.countDocuments();

//     // Thống kê số lượng khách hàng mới
//     const totalNewCustomers = await AuthModel.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfDay, $lte: endOfDay },
//         },
//       },
//       {
//         $count: "totalNewCustomers",
//       },
//     ]);

//     // Thống kê tổng doanh thu và lợi nhuận
//     const totalRevenue = await BillModel.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$money" },
//           totalProfit: { $sum: { $subtract: ["$money", "$expenses"] } },
//         },
//       },
//     ]);

//     // Trả về kết quả thống kê dưới dạng JSON
//     return res.status(200).json({
//       // Tổng doanh số bán hàng trong khoảng thời gian xác định
//       totalSales: totalSales.length > 0 ? totalSales[0].totalSales : 0,

//       // Sản phẩm bán chạy nhất trong khoảng thời gian xác định
//       mostSoldProduct:
//         mostSoldProduct.length > 0 ? mostSoldProduct[0]._id : null,

//       // Tỷ lệ chuyển đổi từ số lượt truy cập sản phẩm sang số lượt đặt hàng
//       conversionRate: conversionRate,

//       // Tổng số lượt truy cập trang web trong khoảng thời gian xác định
//       totalPageVisits:
//         totalPageVisits.length > 0 ? totalPageVisits[0].totalPageVisits : 0,

//       // Tổng số đơn hàng được đặt trong khoảng thời gian xác định
//       totalOrders: totalOrders,

//       // Tổng số khách hàng mới đăng ký hoặc mua hàng trong khoảng thời gian xác định
//       totalNewCustomers:
//         totalNewCustomers.length > 0
//           ? totalNewCustomers[0].totalNewCustomers
//           : 0,

//       // Tổng doanh thu từ tất cả các giao dịch bán hàng trong khoảng thời gian xác định
//       totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,

//       // Tổng lợi nhuận từ tất cả các giao dịch bán hàng sau khi trừ đi chi phí vận hành và tiếp thị
//       totalProfit: totalRevenue.length > 0 ? totalRevenue[0].totalProfit : 0,
//     });
//   } catch (error) {
//     // Xử lý lỗi nếu có
//     return res.status(500).json({
//       message: "Lỗi khi thực hiện thống kê: " + error.message,
//     });
//   }
// };
