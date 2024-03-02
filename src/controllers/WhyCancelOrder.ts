import WhyCancelOrderModel from "../models/WhyCancelOrder";
import whyCancelOrderSchema from "../validation/whycancenorder";

export const WhyCancelOrder = async (req, res) => {
  try {
    const { error } = whyCancelOrderSchema.validate(req.body.datas);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    // Trích xuất dữ liệu từ req.body
    const { iduser, idpro, idprotype, ...message } = req.body;

    // Kiểm tra tính hợp lệ của userId và productTypeId
    if (!iduser || !idpro || !idprotype) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc: userId hoặc productTypeId hoặc .",
      });
    }

    // Kiểm tra tính hợp lệ của userId và productTypeId so với cơ sở dữ liệu,
    // ví dụ: kiểm tra xem userId có tồn tại không.

    // Tạo mới đối tượng comment
    const data = await WhyCancelOrderModel.create({
      ...message,
      iduser,
      idpro,
      idprotype,
    });
    console.log(data);

    // Kiểm tra nếu không tạo được comment
    if (!data) {
      return res.status(404).json({
        message: "Tạo lí do hủy đơn hàng thất bại.",
      });
    }

    // Trả về phản hồi thành công
    return res.status(200).json({
      message: "Tạo lí do hủy đơn hàng thành công.",
      data,
    });
  } catch (error) {
    // Xử lý các loại lỗi khác nhau
    return res.status(500).json({
      message: "Lỗi khi tạo lí do hủy đơn hàng : " + error.message,
    });
  }
};
export const getAllWhyCancelOrder = async (req, res) => {
  try {
    const data = await WhyCancelOrderModel.find({});
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
