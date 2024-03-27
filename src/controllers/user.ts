import AuthModel from "../models/auth";
import { setEmployeeCode } from "./auth";
export const getUserProfile = async (req, res) => {
  try {
    const datas = await AuthModel.findById(req.params.id);
    if (!datas) {
      return res.status(404).json({
        mes: "Thất bại thông tin khách hàng",
      });
    }
    return res.status(200).json({
      mes: "Lấy thành công thông tin thông khách hàng ",
      datas,
    });
  } catch (error) {
    return res.status(500).json({
      mes: error.mes,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const datas = await AuthModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!datas) {
      return res.status(404).json({
        mes: "Cập nhật thông tin thất bại",
      });
    }
    return res.status(200).json({
      mes: "Cập nhật thông tin thành công",
      data: datas,
    });
  } catch (error) {
    return res.status(500).json({
      datas: error.mes,
    });
  }
};
export const updateUserRole = async (req, res) => {
  try {
    const userData = await AuthModel.findById(req.params.id);
    console.log(userData);

    if (!userData) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    // Kiểm tra xem người dùng có đầy đủ các trường cần thiết không
    const { imgUser, address, gender, phone } = userData;
    if (!imgUser || !address || !gender || !phone) {
      return res.status(500).json({
        message: "Tài khoản không đầy đủ thông tin cơ bản",
      });
    }
    const datas = await AuthModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!datas) {
      return res.status(404).json({
        message: "Cập nhật thất bại quyền tài khoản",
      });
    }
    // await setEmployeeCode(req, res);
    return res.status(200).json({
      mes: "Cập nhật thành công quyền tài khoản ",
      data: datas,
    });
  } catch (error) {
    return res.status(500).json({
      datas: error.message,
    });
  }
};

//   try {
//     // Lấy dữ liệu người dùng hiện tại từ cơ sở dữ liệu
//     const existingData = await AuthModel.findById(req.params.id);

//     // Kiểm tra xem người dùng có tồn tại hay không
//     if (!existingData) {
//       return res.status(404).json({
//         mes: "Người dùng không tồn tại",
//       });
//     }

//     // Cập nhật các trường cũ

//     // Cập nhật các trường mới
//     existingData.imgUser = req.body.imgUser || existingData.imgUser;
//     existingData.age = req.body.age || existingData.age;
//     existingData.gender = req.body.gender || existingData.gender;
//     existingData.address = req.body.address || existingData.address;
//     existingData.phone = req.body.phone || existingData.phone;

//     // Lưu trạng thái cập nhật
//     const updatedData = await existingData.save();

//     return res.status(200).json({
//       mes: "Cập nhật thông tin thành công",
//       data: updatedData,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       mes: "Có lỗi xảy ra khi cập nhật thông tin",
//       error: error.message,
//     });
//   }
// };
