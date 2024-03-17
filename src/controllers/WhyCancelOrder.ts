import WhyCancelOrderModel from "../models/WhyCancelOrder";
import BillModel, { OrderDetailModel } from "../models/bill";
import ProductModel from "../models/product";
import TypeProductModel from "../models/typeProduct";
import whyCancelOrderSchema from "../validation/whycancenorder";
// xong whyorder
// tạo lí do
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

export const WhyCancelOrder = async (req, res) => {
  try {
    const { error } = whyCancelOrderSchema.validate(req.body.datas);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    // Trích xuất dữ liệu từ req.body
    const { iduser, idpro, idprotype, idbill, ...message } = req.body;

    // Kiểm tra tính hợp lệ của userId và productTypeId
    if (!iduser || !idpro || !idprotype || !idbill) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc: userId hoặc productTypeId hoặc .",
      });
    }

    // Kiểm tra tính hợp lệ của userId và productTypeId so với cơ sở dữ liệu,
    // ví dụ: kiểm tra xem userId có tồn tại không.

    // Tạo mới đối tượng comment
    const data = await WhyCancelOrderModel.create({
      ...message,
      ExistsInStock: true,
      iduser,
      idpro,
      idprotype,
      idbill,
    });
    console.log(data);

    // Kiểm tra nếu không tạo được comment
    if (!data) {
      return res.status(404).json({
        message: "Tạo lí do hủy đơn hàng thất bại.",
      });
    }
    await BillModel.updateOne({ _id: idbill }, { orderstatus: "Đã hủy hàng" });

    const billDetails = await OrderDetailModel.find({ idbill });

    // Duyệt qua từng sản phẩm và cập nhật số lượng trong kho
    for (const billDetail of billDetails) {
      const { idprotype, quantity } = billDetail;
      await increaseProductQuantity(idprotype, quantity);
    }
    // Trả về phản hồi thành công
    return res.status(200).json({
      message: "Tạo lí do hủy đơn hàng thành công.",
      billDetails,
      data,
    });
  } catch (error) {
    // Xử lý các loại lỗi khác nhau
    return res.status(500).json({
      message: "Lỗi khi tạo lí do hủy đơn hàng : " + error.message,
    });
  }
};
// /lấy toàn bộ lí do
export const getAllWhyCancelOrder = async (req, res) => {
  try {
    const data = await WhyCancelOrderModel.find({ ExistsInStock: true });
    if (!data) {
      return res.status(404).json({
        message: "lấy danh sách lí do thất bại",
      });
    }
    return res.status(200).json({
      message: "lấy danh sách lí do thành công",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const removeWhyOrder = async (req, res) => {
  try {
    const data = await WhyCancelOrderModel.findByIdAndUpdate(
      req.params.id,
      { ExistsInStock: false },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        message: "Xóa lí do thất bại",
      });
    }
    return res.status(200).json({
      message: "Xóa lí do thành công",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateWhyOrder = async (req, res) => {
  try {
    const data = await WhyCancelOrderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!data) {
      return res.status(404).json({
        message: "Cập nhật khuyến mại thất bại",
      });
    }
    return res.status(200).json({
      message: "Cập nhật khuyến mại thành công",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
