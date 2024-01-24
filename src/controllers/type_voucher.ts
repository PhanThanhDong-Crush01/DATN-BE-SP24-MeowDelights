import dotenv from "dotenv";
import typeVoucher from "../models/typeVoucher";
import typeVoucherSchema from "../validation/typeVoucher";
dotenv.config();

export const getAllTypeVoucher = async (req, res) => {
  try {
    // const { data } = await axios.get(`${API_URL}/typeVoucher`);
    const data = await typeVoucher.find();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy loại danh mục mã khuyến mại",
      });
    }

    return res.status(200).json({
      message: "Gọi danh sách loại danh mục mã khuyến mại thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getOneTypeVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    // const { data } = await axios.get(`${API_URL}/typeVoucher/${id}`);
    const data = await typeVoucher.findById(id);

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy loại danh mục mã khuyến mại",
      });
    }

    return res.status(200).json({
      message: "Gọi chi tiết loại danh mục mã khuyến mại thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const createTypeVoucher = async (req, res) => {
  try {
    const body = req.body;
    const data = await typeVoucher.create(body);
    console.log(data);
    const { error } = typeVoucherSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    if (!data) {
      return res.status(404).json({
        message: "Tạo mới loại danh mục mã khuyến mại thất bại!",
      });
    }

    return res.status(200).json({
      message: "Tạo mới loại danh mục mã khuyến mại thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateTypeVoucher = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;
    // const { data } = await axios.put(`${API_URL}/typeVoucher/${id}`, body);
    const data = await typeVoucher.findByIdAndUpdate(id, body, { new: true });

    console.log(data);
    const { error } = typeVoucherSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    if (!data) {
      return res.status(404).json({
        message: "Cập nhật loại danh mục mã khuyến mại thất bại!",
      });
    }
    ///fygkyihhgj,hjmghgj
    return res.status(200).json({
      message: "Cập nhật loại danh mục mã khuyến mại thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const remoteTypeVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    // const { status } = await axios.delete(`${API_URL}/typeVoucher/${id}`);
    const data = await typeVoucher.findByIdAndDelete(id);

    console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "Xoá loại danh mục mã khuyến mại thất bại!",
      });
    }

    return res.status(200).json({
      message: "Xoá loại danh mục mã khuyến mại thành công!",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Xoá loại danh mục mã khuyến mại thất bại!",
    });
  }
};
