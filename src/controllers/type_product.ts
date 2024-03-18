import TypeProductModel from "../models/typeProduct";
import { typeProductSchema } from "../validation/product";
import typeVoucherSchema from "../validation/typeVoucher";

export const create_type_product = async (
  req: any,
  res: any,
  typeProductData: any
) => {
  try {
    const type_product = await TypeProductModel.create(typeProductData);
    if (!type_product) {
      return res.status(500).json({
        message: "Thêm loại sản phẩm thất bại",
      });
    }
    return true;
  } catch (error) {
    console.error(`Error in create_type_product: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const update = async (req: any, res: any) => {
  try {
    const { error } = typeVoucherSchema.validate(req.body.product);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const type_pro = await TypeProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!type_pro) {
      return res.json({
        message: "Sửa loại sản phẩm thất bại",
      });
    }
    return res.json({
      message: "Sửa loại sản phẩm thành công",
      data: type_pro,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const data: any = await TypeProductModel.create(req.body);
    if (!data) {
      return res.status(404).json({
        message: "Tạo loại sản phẩm mới thất bại",
      });
    }
    return res.status(200).json({
      message: "Tạo loại sản phẩm mới thành công",
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
    const data = await TypeProductModel.findById(req.params.id, {
      ExistsInStock: true,
    });
    if (!data) {
      return res.status(404).json({
        message: "Loại sản phẩm không tồn tại",
      });
    }
    return res.status(200).json({
      message: "Chi tiết loại sản phẩm",
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
    const data = await TypeProductModel.findByIdAndUpdate(req.params.id, {
      ExistsInStock: false,
    });
    if (!data) {
      return res.status(404).json({
        message: "Không thể xóa loại sản phẩm",
      });
    }
    return res.status(200).json({
      message: "Xóa loại sản phẩm thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await TypeProductModel.find({
      ExistsInStock: true,
    });
    if (!data) {
      return res.status(404).json({
        message: "Loại sản phẩm không tồn tại",
      });
    }
    const newData = data.filter((item) => item.idPro == req.params.id);
    return res.status(200).json({
      message: "Danh sách loại sản phẩm",
      data: newData,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
