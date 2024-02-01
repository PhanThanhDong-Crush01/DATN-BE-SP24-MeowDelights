import TypeVoucherModel from "../models/typeVoucher";
import Voucher from "../models/voucher";
export const createVoucher = async (req, res) => {
  try {
    const data = await Voucher.create(req.body);
    if (!data) {
      return res.status(404).json({
        message: "tạo khuyến mãi thất bại",
      });
    }
    return res.status(200).json({
      message: "Tạo khuyến mãi thành công ",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "lỗi khi thêm voucher: " + error.message,
    });
  }
};
export const getAllVoucher = async (req, res) => {
  try {
    const data = await Voucher.find({});
    if (!data) {
      return res.status(404).json({
        message: "lấy danh sách khuyến mại thất bại",
      });
    }
    return res.status(200).json({
      message: "lấy danh sách khuyến mại thành công",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getDetailVoucher = async (req, res) => {
  try {
    const data = await Voucher.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Lấy khuyến mại chi tiết thất bại",
      });
    }
    const typeVoucher = await TypeVoucherModel.findById(data.idTypeVoucher);

    return res.status(200).json({
      message: "Lấy khuyến mại chi tiết thành công",
      datas: { ...data._doc, typeVoucher: typeVoucher._doc.name },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const removeVoucher = async (req, res) => {
  try {
    const data = await Voucher.findByIdAndDelete(req.params.id);
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

export const updateVoucher = async (req, res) => {
  try {
    const data = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
