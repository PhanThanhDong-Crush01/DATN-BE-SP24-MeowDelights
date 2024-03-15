import MyVoucherModel from "../models/myVoucher";
import TypeVoucherModel from "../models/typeVoucher";
import VoucherModel from "../models/voucher";
export const createMyVoucher = async (req, res) => {
  try {
    const data = await MyVoucherModel.create(req.body);
    if (!data) {
      return res.status(404).json({
        message: "tạo khuyến mãi của user thất bại",
      });
    }
    return res.status(200).json({
      message: "Tạo khuyến mãi của user thành công ",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "lỗi khi thêm voucher: " + error.message,
    });
  }
};
export const getAllMyVoucher = async (req, res) => {
  try {
    const idVc = req.params.id;
    const data = await MyVoucherModel.find(
      { idVoucher: idVc },
      {
        ExistsInStock: true,
      }
    );
    if (!data) {
      return res.status(404).json({
        message: "lấy danh sách khuyến mại thất bại",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách khuyến mại thành công",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getAllMyVoucherUser = async (req, res) => {
  try {
    const idUser = req.params.id;
    const data = await MyVoucherModel.find({ idUser: idUser });
    if (!data) {
      return res.status(404).json({
        message: "lấy danh sách khuyến mại thất bại",
      });
    }

    const myVoucher = await Promise.all(
      data.map(async (item) => {
        console.log("🚀 ~ data.map ~ item:", item);
        const voucher = await VoucherModel.findById(item?._doc?.idVoucher);
        if (voucher !== null) {
          return { ...item?._doc, voucher };
        }
      })
    );
    // Filter out null vouchers
    const validVouchers = myVoucher.filter((voucher) => voucher !== undefined);

    return res.status(200).json({
      message: "Lấy danh sách khuyến mại thành công",
      datas: validVouchers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getDetailMyVoucher = async (req, res) => {
  try {
    const data = await MyVoucherModel.findById(req.params.id, {
      ExistsInStock: true,
    });
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
export const removeMyVoucher = async (req, res) => {
  try {
    const data = await MyVoucherModel.findByIdAndUpdate(req.params.id, {
      ExistsInStock: false,
    });
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

export const updateMyVoucher = async (req, res) => {
  try {
    const data = await MyVoucherModel.findByIdAndUpdate(
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

export const decreaseMyVoucherQuantity = async (voucherId) => {
  try {
    // Tìm voucher theo ID
    const voucher = await MyVoucherModel.findById(voucherId);

    // Kiểm tra nếu không tìm thấy voucher
    if (!voucher) {
      return {
        success: false,
        message: "Không tìm thấy voucher",
      };
    }

    // Giảm số lượng voucher đi 1 đơn vị
    voucher.quantity -= 1;

    // Lưu lại thay đổi
    await voucher.save();

    return true;
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi giảm số lượng voucher: " + error.message,
    };
  }
};
