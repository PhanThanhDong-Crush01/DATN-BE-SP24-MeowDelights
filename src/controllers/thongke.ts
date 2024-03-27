import AuthModel from "../models/auth";
import BillModel, { OrderDetailModel } from "../models/bill";
import CategoryModel from "../models/category";
import ProductModel from "../models/product";
import moment from "moment";

export const thong_ke_top10_user = async (req, res) => {
  try {
    const users = await AuthModel.find({ ExistsInStock: true });
    if (users.length === 0) {
      return res.status(404).json({
        message: "Không có tài khoản nào",
      });
    }

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Lấy danh sách hóa đơn của người dùng
        const userBills = await BillModel.find({
          iduser: user._id,
        });

        // Tính tổng số hóa đơn
        const totalBillCount = userBills.length;

        // Tính tổng tiền đã mua
        const totalAmount = userBills.reduce(
          (acc, bill) => acc + bill.money,
          0
        );

        // Trả về thông tin người dùng kèm theo số hóa đơn, tổng tiền đã mua, và tổng số sản phẩm đã mua
        return {
          _id: user._id,
          username: user.name,
          email: user.email,
          phone: user.phone,
          totalBillCount: totalBillCount,
          totalAmount: totalAmount,
        };
      })
    );

    // Sắp xếp danh sách người dùng theo tổng tiền đã mua và lấy top 10
    const top10Users = usersWithStats
      .sort((a, b) => b?.totalAmount - a?.totalAmount)
      .slice(0, 5);

    return res.status(200).json({ data: top10Users });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi thực hiện thống kê: " + error.message,
    });
  }
};

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
  // Sử dụng aggregation framework của Mongoose để thống kê tổng doanh thu và số lượng của từng sản phẩm
  const topSellingProducts = await OrderDetailModel.aggregate([
    {
      $group: {
        _id: "$idpro",
        totalRevenue: { $sum: "$money" },
        totalQuantity: { $sum: "$quantity" }, // Thêm tổng số lượng của mỗi sản phẩm
      },
    },
    {
      $sort: { totalRevenue: -1 },
    },
    {
      $limit: 5,
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
        totalQuantity: product.totalQuantity, // Thêm số lượng vào kết quả trả về
      };
    })
  );

  return topProductsDetails;
};

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
        message: "Khoảng cách giữa 2 ngày truy vấn không được lớn hơn 15 ngày.",
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
    const bangtongke = [["Category", "Tổng tiền"]]; // Khởi tạo bảng tổng kê
    let totalRevenueOfYear = 0; // Khởi tạo tổng doanh thu của cả năm

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
      }).populate({
        path: "idbill",
        match: { paymentstatus: "Đã thanh toán" },
      });

      let totalRevenue = 0;
      let categoryInfo = {};

      if (monthlyOrders.length > 0) {
        // Lặp qua các đơn hàng của tháng để tính tổng doanh thu và thông tin về danh mục
        for (const order of monthlyOrders) {
          totalRevenue += order.money;
          totalRevenueOfYear += order.money; // Cập nhật tổng doanh thu của cả năm

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

        // Thêm thông tin tổng tiền mỗi danh mục vào bảng tổng kê
        bangtongke.push([category.name, categoryInfo[category._id.toString()]]);
      });

      // Lưu tổng doanh thu của tháng và thông tin về danh mục vào đối tượng revenueData
      revenueData[`${year}-${monthString}`] = {
        totalRevenue,
        categories: categoriesDetail,
      };
    }

    return res
      .status(200)
      .json({ revenueData, bangtongke, totalRevenueOfYear });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi thực hiện thống kê: " + error.message,
    });
  }
};

export const getTop10ViewProducts = async (req: any, res: any) => {
  try {
    // Truy vấn danh sách sản phẩm và sắp xếp theo số lượt xem giảm dần, chỉ lấy 10 sản phẩm đầu tiên
    const products = await ProductModel.find()
      .sort({ view: -1 }) // Sắp xếp giảm dần theo số lượt xem
      .limit(5); // Giới hạn số lượng sản phẩm trả về là 10

    // Trả về danh sách sản phẩm
    const response: any = {
      products: products,
    };

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const thong_ke = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Kiểm tra nếu ngày bắt đầu và kết thúc không quá 10 ngày hiện tại
    const today = moment().startOf("day");
    const start = moment(startDate).startOf("day");
    const end = moment(endDate).endOf("day");

    // Kiểm tra nếu startDate bé hơn endDate
    if (moment(startDate).isAfter(moment(endDate))) {
      return res
        .status(400)
        .json({ message: "Ngày bắt đầu không thể sau ngày kết thúc." });
    }

    let totalRevenue = 0;
    const revenueEveryDay = {};
    const bangtongkeMap = {}; // Sử dụng một object để tính tổng tiền của từng danh mục

    // Duyệt qua từng ngày trong khoảng thời gian từ startDate đến endDate
    for (
      let currentDate = moment(start);
      currentDate.isSameOrBefore(end);
      currentDate.add(1, "day")
    ) {
      const date = currentDate.format("YYYY-MM-DD");
      let dailyRevenue = 0;
      let productsSold: any = [];

      // Tìm tất cả các hóa đơn được thanh toán vào ngày currentDate
      const startOfDay = moment(currentDate).startOf("day");
      const endOfDay = moment(currentDate).endOf("day");
      const bills = await BillModel.find({
        paymentstatus: "Đã thanh toán",
        updatedAt: { $gte: startOfDay, $lte: endOfDay },
      });

      // Nếu không có hóa đơn nào được tìm thấy vào ngày currentDate, thì gán dailyRevenue là 0
      if (!bills || bills.length === 0) {
        revenueEveryDay[date] = {
          money: 0,
          products: [],
        };
      } else {
        // Nếu có hóa đơn vào ngày currentDate, tính tổng doanh thu và tìm các sản phẩm được bán
        for (const bill of bills) {
          dailyRevenue += bill.money;
          const orderDetails = await OrderDetailModel.find({
            idbill: bill._id,
          });
          for (const orderDetail of orderDetails) {
            // Thêm sản phẩm vào danh sách nếu chưa có
            const existingProductIndex = productsSold.findIndex(
              (p: any) => p.idpro === orderDetail.idpro
            );
            if (existingProductIndex !== -1) {
              // Nếu sản phẩm đã tồn tại, cộng thêm doanh thu vào sản phẩm đó
              productsSold[existingProductIndex].money += orderDetail.money;
              productsSold[existingProductIndex].quantity +=
                orderDetail.quantity;
            } else {
              // Nếu sản phẩm chưa tồn tại, thêm vào danh sách sản phẩm đã bán
              productsSold.push({
                idpro: orderDetail.idpro,
                namePro: orderDetail.namePro,
                quantity: orderDetail.quantity,
                money: orderDetail.money,
              });
            }
          }
          totalRevenue += bill.money;
        }
        revenueEveryDay[date] = {
          money: dailyRevenue,
          products: productsSold,
        };

        // Thống kê tổng tiền của từng danh mục trong ngày và cập nhật vào bangtongkeMap
        for (const product of productsSold) {
          const productInfo = await ProductModel.findById(product.idpro);
          const cate = await CategoryModel.findById(productInfo?.idCategory);
          const catename = cate?.name || "Khác"; // Nếu sản phẩm không có danh mục, gán vào danh mục "Khác"
          if (bangtongkeMap[catename]) {
            bangtongkeMap[catename] += product.money;
          } else {
            bangtongkeMap[catename] = product.money;
          }
        }
      }
    }

    // Chuyển đổi bangtongkeMap thành mảng bangtongke
    const bangtongke = [
      ["Danh mục", "Doanh thu"],
      ...Object.entries(bangtongkeMap).map(([category, money]) => [
        category,
        money,
      ]),
    ];

    return res.status(200).json({
      totalRevenue,
      revenueEveryDay,
      bangtongke,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi thực hiện thống kê: " + error.message,
    });
  }
};
