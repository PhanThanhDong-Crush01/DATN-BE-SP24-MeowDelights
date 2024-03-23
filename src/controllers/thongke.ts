import BillModel, { OrderDetailModel } from "../models/bill";
import CategoryModel from "../models/category";
import ProductModel from "../models/product";

// Hàm thống kê 10 sản phẩm bán được nhiều tiền nhất
export const thong_ke_top_10_product = async (req, res) => {
  try {
    const topSellingProducts = await getTopSellingProducts();
    return res.status(200).json({ success: true, data: topSellingProducts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi thực hiện thống kê: " + error.message,
    });
  }
};

// Hàm lấy danh sách 10 sản phẩm bán được nhiều tiền nhất
const getTopSellingProducts = async () => {
  // Sử dụng aggregation framework của Mongoose để thống kê tổng doanh thu của từng sản phẩm
  const topSellingProducts = await OrderDetailModel.aggregate([
    {
      $group: {
        _id: "$idpro",
        totalRevenue: { $sum: "$money" },
      },
    },
    {
      $sort: { totalRevenue: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  // Lấy thông tin chi tiết của các sản phẩm từ model Product
  const topProductsDetails = await Promise.all(
    topSellingProducts.map(async (product) => {
      const productDetail: any = await ProductModel.findById(product._id);
      return {
        _id: productDetail._id,
        name: productDetail.name,
        status: productDetail.status,
        totalRevenue: product.totalRevenue,
      };
    })
  );

  return topProductsDetails;
};

import moment from "moment";

export const thong_ke_doanh_thu = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const start = moment(startDate).startOf("day");
    const end = moment(endDate).endOf("day");
    const inputStartDate = moment(startDate).startOf("day");
    const inputEndDate = moment(endDate).startOf("day");
    const currentDate = moment().startOf("day");

    if (
      !inputStartDate.isBefore(currentDate) ||
      !inputEndDate.isBefore(currentDate)
    ) {
      return res
        .status(400)
        .json({ message: "startDate và endDate phải nhỏ hơn ngày hiện tại." });
    }

    if (inputStartDate.isSameOrAfter(inputEndDate)) {
      return res
        .status(400)
        .json({ message: "startDate phải nhỏ hơn endDate." });
    }

    // Kiểm tra nếu khoảng cách giữa startDate và endDate lớn hơn 30 ngày
    const diffInDays = moment(endDate).diff(moment(startDate), "days");
    if (diffInDays > 15) {
      return res.status(400).json({
        message: "Khoảng cách giữa 2 ngày truy vấn không được lớn hơn 30 ngày.",
      });
    }

    const revenueData = {};

    const dates: any = [];
    for (
      let date: any = moment(start);
      date.isSameOrBefore(end);
      date.add(1, "day")
    ) {
      dates.push(date.format("YYYY-MM-DD"));
    }

    for (const currentDate of dates) {
      const nextDate = moment(currentDate).add(1, "day").format("YYYY-MM-DD");

      const dailyOrders = await OrderDetailModel.find({
        createdAt: { $gte: new Date(currentDate), $lt: new Date(nextDate) },
      });

      let totalRevenue = 0;
      let soldProducts: any = [];

      if (dailyOrders.length > 0) {
        dailyOrders.forEach((order) => {
          totalRevenue += order.money;
          soldProducts.push({
            _id: order._id,
            idbill: order.idbill,
            idpro: order.idpro,
            namePro: order.namePro,
            idprotype: order.idprotype,
            nameTypePro: order.nameTypePro,
            imageTypePro: order.imageTypePro,
            quantity: order.quantity,
            money: order.money,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          });
        });
      }

      // Thêm thông tin về danh mục sản phẩm đã bán được bao nhiêu tiền
      const categories = await getCategoryInfo(soldProducts);

      revenueData[currentDate] = {
        totalRevenue,
        soldProducts,
        categories,
      };
    }

    return res.status(200).json({ revenueData });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi thực hiện thống kê: " + error.message,
    });
  }
};

// Hàm để lấy thông tin về danh mục sản phẩm đã bán được bao nhiêu tiền
async function getCategoryInfo(soldProducts) {
  const categoryInfo = {};

  // Lặp qua từng sản phẩm đã bán
  for (const product of soldProducts) {
    const { idpro, money } = product;

    // Tìm danh mục của sản phẩm
    const productInfoOrderDetail: any = await ProductModel.findById(idpro);

    const categoryId = productInfoOrderDetail?._doc?.idCategory.toString();

    // Thêm số tiền vào danh mục tương ứng
    if (categoryInfo[categoryId]) {
      categoryInfo[categoryId] += money;
    } else {
      categoryInfo[categoryId] = money;
    }
  }

  // Lấy thông tin chi tiết về danh mục từ database (tên, ...)
  const categories = await CategoryModel.find({
    _id: { $in: Object.keys(categoryInfo) },
  });

  // Tạo đối tượng chứa thông tin về danh mục
  const categoriesDetail = {};
  categories.forEach((category) => {
    categoriesDetail[category._id.toString()] = {
      name: category.name,
      totalRevenue: categoryInfo[category._id.toString()],
    };
  });

  return categoriesDetail;
}

export const thong_ke_doanh_thu_thang_trong_nam = async (req, res) => {
  try {
    const year = req.params.id;
    let currentDate = moment().startOf("year").year(year); // Lấy ngày đầu tiên của năm
    const endDate = moment(currentDate).endOf("year"); // Lấy ngày cuối cùng của năm

    const revenueData = {};

    // Lặp qua từng tháng trong năm
    for (
      let currentMonth = moment(currentDate).startOf("month");
      currentMonth.isSameOrBefore(endDate, "month");
      currentMonth.add(1, "month")
    ) {
      const month = currentMonth.month() + 1; // Lấy số tháng (từ 1 đến 12)
      const monthString = month < 10 ? `0${month}` : `${month}`; // Chuyển số tháng thành chuỗi (có thêm '0' nếu cần)

      const startOfMonth = currentMonth;
      const endOfMonth = moment(currentMonth).endOf("month");

      // Tính tổng doanh thu của tháng hiện tại
      const monthlyOrders = await OrderDetailModel.find({
        createdAt: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
      });

      let totalRevenue = 0;
      let categoryInfo = {};

      if (monthlyOrders.length > 0) {
        // Lặp qua các đơn hàng của tháng để tính tổng doanh thu và thông tin về danh mục
        for (const order of monthlyOrders) {
          totalRevenue += order.money;

          // Lấy thông tin sản phẩm từ OrderDetailModel
          const productInfoOrderDetail: any = await ProductModel.findById(
            order.idpro
          );

          const categoryId =
            productInfoOrderDetail?._doc?.idCategory.toString();

          // Thêm số tiền vào danh mục tương ứng
          if (categoryInfo[categoryId]) {
            categoryInfo[categoryId] += order.money;
          } else {
            categoryInfo[categoryId] = order.money;
          }
        }
      }

      // Lấy thông tin chi tiết về danh mục từ database (tên, ...)
      const categories = await CategoryModel.find({
        _id: { $in: Object.keys(categoryInfo) },
      });

      // Tạo đối tượng chứa thông tin về danh mục
      const categoriesDetail = {};
      categories.forEach((category) => {
        categoriesDetail[category._id.toString()] = {
          name: category.name,
          totalRevenue: categoryInfo[category._id.toString()],
        };
      });

      // Lưu tổng doanh thu của tháng và thông tin về danh mục vào đối tượng revenueData
      revenueData[`${year}-${monthString}`] = {
        totalRevenue,
        categories: categoriesDetail,
      };
    }

    return res.status(200).json({ revenueData });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi thực hiện thống kê: " + error.message,
    });
  }
};
