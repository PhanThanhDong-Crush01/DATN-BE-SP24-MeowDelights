import Category from "../models/category.js";
import { categoryValid } from "../validation/category.js";
import { ICategory } from '../interface/ICategory.js';

export const getAll = async (req, res) => {
  try {
    const data = await Category.find({}).populate("products");
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không có danh mục để hiển thị",
      });
    }
    return res.status(200).json({
      message: "Danh sách danh mục",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const getDetail = async (req, res) => {
  try {
    const data = await Category.findById(req.params.id).populate("products");
    if (!data) {
      return res.status(404).json({
        message: "Danh mục không tồn tại",
      });
    }
    return res.status(200).json({
      message: "Chi tiết danh mục",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const { error } = categoryValid.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const data: ICategory = await Category.create(req.body);
    if (!data) {
      return res.status(404).json({
        message: "Tạo danh mục mới thất bại",
      });
    }
    return res.status(200).json({
      message: "Tạo danh mục mới thanh công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { error } = categoryValid.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const data = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({
        message: "Cập nhật danh mục thất bại",
      });
    }
    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const data = await Category.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Không thể xóa danh mục",
      });
    }
    return res.status(200).json({
      message: "Xóa danh mục thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
