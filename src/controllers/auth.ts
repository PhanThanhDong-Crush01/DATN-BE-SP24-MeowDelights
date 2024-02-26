import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import jwt from "jsonwebtoken";
import { signinSchema, signupSchema } from "../validation/auth";
import auth from "../models/auth";

dotenv.config();
export const getAll = async (req, res) => {
  try {
    const user = await auth.find();
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
    const user = await auth.findByIdAndDelete(req.params.id);
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
