import AuthModel from "../models/auth";
import BillModel from "../models/bill";
import MyVoucherModel from "../models/myVoucher";
import TypeVoucherModel from "../models/typeVoucher";
import VoucherModel from "../models/voucher";
import Voucher from "../models/voucher";
export const createVoucher = async (req, res) => {
  try {
    const voucher = req.body.voucher;
    const phanPhatVoucher = req.body.phanPhatVoucher;
    const data = await Voucher.create(voucher);
    if (!data) {
      return res.status(404).json({
        message: "tạo khuyến mãi thất bại",
      });
    }

    const idVoucher = data._id;
    const users: any = await AuthModel.find();
    let totalQuantity: number = 0; // Tổng số lượng voucher đã tạo

    // Sắp xếp phanPhatVoucher theo thứ tự giảm dần của minTotalBill
    const phanPhatVoucherSort = phanPhatVoucher.sort((a, b) => {
      return parseInt(b.minTotalBil) - parseInt(a.minTotalBil);
    });

    // Duyệt qua từng người dùng
    for (const user of users) {
      // Duyệt qua các điều kiện từ phanPhatVoucher để cập nhật quantity
      let quantity = 1;

      for (const item of phanPhatVoucherSort) {
        if (Number(user?.totalAmount) >= Number(item.minTotalBil)) {
          quantity = Number(item.quantity);
          break; // Thoát vòng lặp nếu đã tìm được điều kiện phù hợp
        }
      }

      // Tạo voucher cho user với số lượng đã tính toán
      await MyVoucherModel.create({
        idVoucher: idVoucher,
        idUser: user?._id.toString(),
        quantity: Number(quantity),
      });

      // Cộng dồn số lượng voucher đã tạo
      totalQuantity += Number(quantity);
    }

    return res.status(200).json({
      message: "Tạo khuyến mãi thành công ",
      totalQuantity: totalQuantity, // Trả về tổng số lượng voucher đã tạo

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
    const data = await Voucher.find({
      ExistsInStock: true,
    });
    if (!data) {
      return res.status(404).json({
        message: "lấy danh sách khuyến mại thất bại",
      });
    }
    let soVoucherHetHan = 0;
    const voucher = await Promise.all(
      data.map(async (item) => {
        const type_voucher = await TypeVoucherModel.findById(
          item?._doc?.idTypeVoucher.toString()
        );

        const expiry = new Date(item?._doc?.expiry).getTime();
        if (expiry < Date.now() || item?._doc?.quantity == 0) {
          const newVc = await VoucherModel.findByIdAndUpdate(
            item?._doc?._id.toString(),
            { status: false },
            { new: true }
          );
          if (expiry < Date.now()) {
            soVoucherHetHan++;
          }

          return (item._doc = newVc);
        }

        return { ...item._doc, type_voucher };
      })
    );
    // Đếm số lượng voucher có trạng thái true và false
    const statusTrue = voucher.reduce((count, item) => {
      return count + (item.status ? 1 : 0);
    }, 0);
    const daDungHet = voucher.reduce((count, item) => {
      return count + (item.quantity == 0 ? 1 : 0);
    }, 0);

    const statusFalse = voucher.length - statusTrue;

    return res.status(200).json({
      message: "lấy danh sách khuyến mại thành công",
      statusTrue: statusTrue,
      statusFalse: statusFalse,
      daDungHet: daDungHet,
      soVoucherHetHan: soVoucherHetHan,
      datas: voucher,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getDetailVoucher = async (req, res) => {
  try {
    const data = await Voucher.findById(req.params.id, { ExistsInStock: true });
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
    const data = await Voucher.findByIdAndUpdate(
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
