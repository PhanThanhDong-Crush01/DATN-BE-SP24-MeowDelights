import AuthModel from "../models/auth";
import BillModel from "../models/bill";
import MyVoucherModel from "../models/myVoucher";
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

    const idVoucher = data._id;
    const user: any = await AuthModel.find();
    const userMoney = await Promise.all(
      user.map(async (item) => {
        const bills = await BillModel.find({
          iduser: item?._doc?._id.toString(),
        });

        let totalBill = 0;
        bills.forEach((bill) => {
          totalBill += bill.money;
        });

        if (totalBill > 1000000) {
          await MyVoucherModel.create({
            idVoucher: idVoucher,
            idUser: item?._doc?._id.toString(),
            quantity: 7,
          });
        } else if (totalBill > 700000) {
          await MyVoucherModel.create({
            idVoucher: idVoucher,
            idUser: item?._doc?._id.toString(),
            quantity: 6,
          });
        } else if (totalBill > 500000) {
          await MyVoucherModel.create({
            idVoucher: idVoucher,
            idUser: item?._doc?._id.toString(),
            quantity: 5,
          });
        } else if (totalBill > 300000) {
          await MyVoucherModel.create({
            idVoucher: idVoucher,
            idUser: item?._doc?._id.toString(),
            quantity: 4,
          });
        } else if (totalBill > 100000) {
          await MyVoucherModel.create({
            idVoucher: idVoucher,
            idUser: item?._doc?._id.toString(),
            quantity: 3,
          });
        } else {
          await MyVoucherModel.create({
            idVoucher: idVoucher,
            idUser: item?._doc?._id.toString(),
            quantity: 1,
          });
        }
        return { userId: item?._doc?._id.toString(), totalBill: totalBill };
      })
    );

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
    // console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "Lấy khuyến mại chi tiết thất bại",
      });
    }
    const typeVoucher = await TypeVoucherModel.findById(
      data?._doc?.idTypeVoucher
    );

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

export const decreaseVoucherQuantity = async (voucherId) => {
  try {
    // Tìm voucher theo ID
    const voucher = await Voucher.findById(voucherId);

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
