import TypeProductModel from "../models/typeProduct";
import { typeProductSchema } from "../validation/product";
import typeVoucherSchema from "../validation/typeVoucher";

export const create_type_product = async (
  req: any,
  res: any,
  typeProductData: any
) => {
  try {
    const { error } = typeProductSchema.validate(typeProductData);
    if (error) {
      return res.status(400).json({
        message: `Validation error: ${error.details[0].message}`,
      });
    }

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
