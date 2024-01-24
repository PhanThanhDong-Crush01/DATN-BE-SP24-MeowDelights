import ProductModel from "../models/product";
import TypeProductModel from "../models/typeProduct";
import { productSchema } from "./../validation/product";
import { create_type_product } from "./type_product";

export const create = async (req: any, res: any) => {
  try {
    const { error } = productSchema.validate(req.body.product);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const product = await ProductModel.create(req.body.product);
    if (!product) {
      return res.json({
        message: "Thêm sản phẩm thất bại",
      });
    }

    const idPro = product._id;
    const typeProducts = req.body.typeProduct;
    for (const typePro of typeProducts) {
      const newTypeProduct = { ...typePro, idPro };
      try {
        await create_type_product(req, res, newTypeProduct);
      } catch (error) {
        console.error(`Error in createTypeProduct: ${error.message}`);
      }
    }
    const typeProductsData = await TypeProductModel.find({ idPro: idPro });

    return res.json({
      message: "Thêm sản phẩm và loại sản phẩm thành công",
      data: {
        product,
        typeProducts: typeProductsData,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const get = async function (req, res) {
  try {
    // const product = await ProductModel.findById(req.params.id).populate(
    //   "categoryId"
    // );
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.json({
        message: "Không có sản phẩm nào",
      });
    }

    const types_a_pro = await TypeProductModel.find({
      idPro: product._id,
    });

    return res.json({
      message: "Tìm sản phẩm thành công",
      data: product,
      typeProduct: types_a_pro,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const update = async (req: any, res: any) => {
  try {
    const { error } = productSchema.validate(req.body.product);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.json({
        message: "Sửa sản phẩm thất bại",
      });
    }
    return res.json({
      message: "Sửa sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getAll = async (req: any, res: any) => {}; //phân trang, lọc, xắp xếp
export const remove = async (req: any, res: any) => {}; //lưu trữ pro
export const restore = async (req, res: any) => {}; //phụ hồi pro
