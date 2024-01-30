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

export const getAll = async (req: any, res: any) => {
  try {
    const {
      _sort = "price",
      _order = "asc",
      _limit = 50,
      _page = 1,
    } = req.query;

    const options = {
      page: _page,
      limit: _limit,
      sort: {
        [_sort]: _order === "desc" ? -1 : 1,
      },
    };
    // const { data } = await axios.get(`${API_URL}/Product`);
    const data = await ProductModel.paginate({}, options);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    const newData = await Promise.all(
      data.docs.map(async (itemPro: any) => {
        const typeProducts = await TypeProductModel.find({
          idPro: itemPro._id,
        });

        // Kiểm tra nếu typeProducts rỗng
        if (typeProducts.length === 0) {
          return { ...itemPro._doc, price: null }; // hoặc giá trị mặc định khác nếu cần thiết
        }

        const minPrice = typeProducts.reduce((min, current) => {
          return current.price < min ? current.price : min;
        }, typeProducts[0].price);
        return { ...itemPro._doc, price: minPrice };
      })
    );

    console.log("🚀 ~ getAll ~ newData:", newData);

    return res.status(200).json({
      message: "Gọi danh sách sản phẩm thành công!",
      datas: newData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}; //phân trang, lọc, xắp xếp
export const storage = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    // const { data } = await axios.put(`${API_URL}/Product/${id}`, body);
    const data = await ProductModel.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "Lưu trữ sản phẩm thất bại!",
      });
    }

    return res.status(200).json({
      message: "Lưu trữ sản phẩm thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}; //lưu trữ pro
export const restore = async (req, res: any) => {
  try {
    const id = req.params.id;
    // const { data } = await axios.put(`${API_URL}/Product/${id}`, body);
    const data = await ProductModel.findByIdAndUpdate(
      id,
      { status: true },
      { new: true }
    );

    console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "Phục hồi sản phẩm thất bại!",
      });
    }

    return res.status(200).json({
      message: "Phục hồi sản phẩm thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}; //phụ hồi pro
