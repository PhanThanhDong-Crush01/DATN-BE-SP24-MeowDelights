import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import jwt from "jsonwebtoken";
import { signinSchema, signupSchema } from "../validation/auth";
import auth from "../models/auth";
import AuthModel from "../models/auth";
import BillModel, { OrderDetailModel } from "../models/bill";
import VoucherModel from "../models/voucher";
import MyVoucherModel from "../models/myVoucher";
// // xong auth
dotenv.config();
export const getAllUser = async (req, res) => {
  try {
    const users = await auth.find({ ExistsInStock: true });
    if (users.length === 0) {
      return res.status(404).json({
        massage: "không có tài khoản nào",
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
        const totalAmountNew = userBills.reduce(
          (acc, datas) => acc + datas.money,
          0
        );

        // Trả về thông tin người dùng kèm theo số hóa đơn và tổng tiền đã mua
        return {
          _id: user._id,
          username: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
          age: user.age,
          gender: user.gender,
          imgUser: user.imgUser,
          phone: user.phone,
          employee: user.employee,
          jobPosition: user.jobPosition,
          discount_points: user.discount_points,
          totalBillCount: totalBillCount,
          totalAmount: totalAmountNew,
        };
      })
    );
    const reversedUsersWithStats = usersWithStats.reverse();
    return res.json({
      message: "Hiển thị thành công",
      users: usersWithStats,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.massage,
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const user = await auth.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        massage: "không có tài khoản nào",
      });
    }
    return res.json({
      message: "hiển thị thành công",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.massage,
    });
  }
};

export const removeUser = async (req, res) => {
  try {
    const user = await auth.findByIdAndUpdate(
      req.params.id,
      { ExistsInStock: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        massage: "Xóa tài khoản thất bại",
      });
    }
    return res.json({
      message: "Xóa tài khoản thành công",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.massage,
    });
  }
};
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const { error } = signupSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // kiểm tra tồn tại email

    const userExist = await auth.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await auth.create({
      name,
      email,
      password: hashedPassword,
    });
    user.password = undefined;
    //tao token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: 60 * 60,
    });

    const dataVc = await VoucherModel.find();
    for (const item of dataVc) {
      await MyVoucherModel.create({
        idVoucher: item?._doc?._id,
        idUser: user?._id,
        quantity: 1,
      });
    }

    return res.status(201).json({
      message: "Đăng ký thành công",
      accessToken: token,
      user,
    });
  } catch (error) {}
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = signinSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const user = await auth.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }
    // nó vừa mã hóa và vừa so sánh
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Sai mật khẩu",
      });
    }

    user.password = undefined;
    // tạo token từ server
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: 60 * 60,
    });

    return res.status(201).json({
      message: "Đăng nhập thành công",
      accessToken: token,
      user,
    });
  } catch (error) {}
};

export const AuthWithRole = async (req, res) => {
  try {
    const role = req.params.id;
    let permission = "";
    if (role == 1) {
      permission = "admin";
    } else if (role == 2) {
      permission = "staff";
    } else {
      permission = "member";
    }
    const user = await auth.find({ role: permission });
    if (user.length === 0) {
      return res.status(404).json({
        massage: "không có tài khoản nào",
      });
    }
    return res.json({
      message: "hiển thị thành công",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.massage,
    });
  }
};

export const setEmployeeCode = async (req, res) => {
  try {
    const user: any = await auth.find();

    const employeeCode = await Promise.all(
      user.map(async (item) => {
        if (item._doc.role == "admin" || item._doc.role == "staff") {
          const codeNv =
            "MD" + item._doc._id.toString().slice(-5).toUpperCase();
          const staff: any = await auth.findByIdAndUpdate(
            item._id,
            { employee: codeNv },
            { new: true }
          );
          if (staff.length === 0) {
            return res.status(404).json({
              massage: "không có tài khoản nào",
            });
          }
          return staff;
        }
        return item;
      })
    );
    return res.json({
      message: "hiển thị thành công",
      employeeCode,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.massage,
    });
  }
};

export const createAuth = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu và xác nhận mật khẩu không khớp",
      });
    }

    // Kiểm tra email đã tồn tại trong hệ thống hay chưa
    const userExist = await AuthModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mới người dùng
    const newUser = await AuthModel.create({
      name,
      email,
      password: hashedPassword,
    });
    newUser.password = undefined;

    // Tạo token
    const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: 60 * 60, // Token hết hạn sau 1 giờ
    });

    const dataVc = await VoucherModel.find();
    for (const item of dataVc) {
      await MyVoucherModel.create({
        idVoucher: item?._doc?._id,
        idUser: newUser?._id,
        quantity: 1,
      });
    }

    return res.status(200).json({
      message: "Tạo tài khoản thành công",
      user: newUser,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tạo tài khoản: " + error.message,
    });
  }
};
export const createKhachVangLai = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Kiểm tra email đã tồn tại trong hệ thống hay chưa
    const userExist = await AuthModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mới người dùng
    const newUser = await AuthModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });
    newUser.password = undefined;
    const dataVc = await VoucherModel.find();
    for (const item of dataVc) {
      await MyVoucherModel.create({
        idVoucher: item?._doc?._id,
        idUser: newUser?._id,
        quantity: 1,
      });
    }
    return res.status(200).json({
      message: "Tạo tài khoản thành công",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tạo tài khoản: " + error.message,
    });
  }
};

export const editAuth = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      phone,
      role,
      address,
      employee,
      jobPosition,
      imgUser,
      gender,
      ExistsInStock,
    } = req.body;
    const userId = req.params.id;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await AuthModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    // Cập nhật thông tin người dùng
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      // Mã hóa mật khẩu mới nếu có
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (age) user.age = age;
    if (address) user.address = address;
    if (jobPosition) user.jobPosition = jobPosition;
    if (imgUser) user.imgUser = imgUser;
    if (gender) user.gender = gender;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    if (employee) user.employee = employee;
    if (ExistsInStock) user.ExistsInStock = ExistsInStock;

    // Lưu thông tin người dùng đã chỉnh sửa
    await user.save();

    // Tạo token mới
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: 60 * 60, // Token hết hạn sau 1 giờ
    });

    // Trả về thông điệp thành công và token mới
    return res.status(200).json({
      message: "Chỉnh sửa thông tin người dùng thành công",
      user: user,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi chỉnh sửa thông tin người dùng: " + error.message,
    });
  }
};
export const deleteEmployee = async (req, res) => {
  try {
    const userId = req.body; // Lấy trực tiếp ID của người dùng từ req.body
    console.log(userId);
    // Kiểm tra xem userId có tồn tại không
    const user = await AuthModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: `Không tìm thấy người dùng có ID ${userId}`,
      });
    }

    // Xóa mã nhân viên
    await AuthModel.findByIdAndUpdate(userId, { $unset: { employee: 1 } });

    // Xóa vị trí công việc
    await AuthModel.findByIdAndUpdate(userId, { $unset: { jobPosition: 1 } });

    // Chuyển vai trò thành member
    await AuthModel.findByIdAndUpdate(userId, { role: "member" });

    return res.status(200).json({
      message:
        "Đã xóa mã nhân viên, vị trí công việc và chuyển vai trò thành member thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi xóa nhân viên: " + error.message,
    });
  }
};
