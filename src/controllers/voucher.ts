import AuthModel from "../models/auth";
import BillModel from "../models/bill";
import MyVoucherModel from "../models/myVoucher";
import TypeVoucherModel from "../models/typeVoucher";
import VoucherModel from "../models/voucher";
import Voucher from "../models/voucher";
export const createVoucher = async (req, res) => {
  try {
    const voucher = req.body;
    console.log("🚀 ~ createVoucher ~ voucher:", voucher);
    const data = await Voucher.create(voucher);
    console.log("🚀 ~ createVoucher ~ data:", data);
    if (!data) {
      return res.status(404).json({
        message: "Tạo khuyến mãi thất bại",
      });
    }

    const idVoucher = data._id;
    const users = await AuthModel.find();
    const phanPhatVoucher = [
      {
        minTotalBill: req.body.minTotalBill1,
        quantity: req.body.quantity1,
      },
      {
        minTotalBill: req.body.minTotalBill2,
        quantity: req.body.quantity2,
      },
      {
        minTotalBill: req.body.minTotalBill3,
        quantity: req.body.quantity3,
      },
      {
        minTotalBill: req.body.minTotalBill4,
        quantity: req.body.quantity4,
      },
    ];
    // Sắp xếp phanPhatVoucher theo thứ tự giảm dần của minTotalBill
    const phanPhatVoucherSort = phanPhatVoucher.sort((a, b) => {
      return parseInt(b.minTotalBill) - parseInt(a.minTotalBill);
    });

    // Mảng để lưu trữ ID của các người dùng đã được thêm voucher
    let addedUsers: any = [];

    // Duyệt qua từng người dùng
    for (const user of users) {
      for (const item of phanPhatVoucherSort) {
        if (
          user &&
          user._id &&
          Number(user.totalAmount) >= Number(item.minTotalBill) &&
          !addedUsers.includes(user?._id.toString())
        ) {
          await MyVoucherModel.create({
            idVoucher: idVoucher,
            idUser: user._id.toString(),
            quantity: Number(item.quantity),
          });
          addedUsers.push(user?._id.toString()); // Thêm ID người dùng vào mảng
          break; // Thoát vòng lặp sau khi thêm voucher cho người dùng
        }
      }
    }

    console.log("🚀 ~ createVoucher ~ addedUsers:", addedUsers);
    return res.status(200).json({
      message: "Tạo khuyến mãi thành công",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi thêm voucher: " + error.message,
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
    const id = req.params.id.trim();
    const data = await Voucher.findById(id);
    console.log("🚀 ~ getDetailVoucher ~ data:", data);
    // console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "Lấy khuyến mại chi tiết thất bại",
      });
    }
    const typeVoucher = await TypeVoucherModel.findById(
      data?._doc?.idTypeVoucher.toString()
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
    const dataCu = await Voucher.findById(req.params.id);
    const data = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({
        message: "Cập nhật khuyến mại thất bại",
      });
    }

    const idVoucher = data._id;
    const users: any = await AuthModel.find();
    const phanPhatVoucherCu = [
      {
        minTotalBillCu: dataCu.minTotalBill1,
        quantityCu: dataCu.quantity1,
      },
      {
        minTotalBillCu: dataCu.minTotalBill2,
        quantityCu: dataCu.quantity2,
      },
      {
        minTotalBillCu: dataCu.minTotalBill3,
        quantityCu: dataCu.quantity3,
      },
      {
        minTotalBillCu: dataCu.minTotalBill4,
        quantityCu: dataCu.quantity4,
      },
    ];
    const phanPhatVoucherMoi = [
      {
        minTotalBillMoi: req.body.minTotalBill1,
        quantityMoi: req.body.quantity1,
      },
      {
        minTotalBillMoi: req.body.minTotalBill2,
        quantityMoi: req.body.quantity2,
      },
      {
        minTotalBillMoi: req.body.minTotalBill3,
        quantityMoi: req.body.quantity3,
      },
      {
        minTotalBillMoi: req.body.minTotalBill4,
        quantityMoi: req.body.quantity4,
      },
    ];
    // Sắp xếp phanPhatVoucher theo thứ tự giảm dần của minTotalBilll
    const phanPhatVoucherSortMoi = phanPhatVoucherMoi.sort((a, b) => {
      return parseInt(b.minTotalBillMoi) - parseInt(a.minTotalBillMoi);
    });

    // Duyệt qua từng người dùng
    for (const user of users) {
      const myVoucher = await MyVoucherModel.findOne({
        idUser: user?._id,
        idVoucher: idVoucher,
      });

      if (myVoucher) {
        for (const itemMoi of phanPhatVoucherSortMoi) {
          if (Number(user?.totalAmount) >= Number(itemMoi.minTotalBillMoi)) {
            const voucherphanphat = phanPhatVoucherCu.find(
              (vc) => vc.minTotalBillCu === itemMoi.minTotalBillMoi
            );

            if (voucherphanphat) {
              let quantity =
                Number(itemMoi.quantityMoi) -
                Number(voucherphanphat.quantityCu) +
                Number(myVoucher?.quantity);
              await MyVoucherModel.findByIdAndUpdate(
                myVoucher?._id,
                { quantity: quantity }, // Giá trị cập nhật
                { new: true } // Tùy chọn để trả về tài liệu sau khi cập nhật
              );
              break; // Thoát vòng lặp nếu đã tìm được điều kiện phù hợp
            }
          }
        }
      }

      // Cộng dồn số lượng voucher đã tạo
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
