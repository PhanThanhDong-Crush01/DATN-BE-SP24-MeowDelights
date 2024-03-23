import { OrderDetailModel } from "../models/bill";
import CategoryModel from "../models/category";
import CommentModel from "../models/comment";
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

    const product: any = await ProductModel.create(req.body.product);
    if (!product) {
      return res.json({
        message: "Thêm sản phẩm thất bại",
      });
    }

    const idPro = product?._doc?._id;
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
    const productId = req.params.id;
    const products = req.body;

    // Lấy thông tin sản phẩm
    const product: any = await ProductModel.findById(productId, products, {
      ExistsInStock: true,
    });
    if (!product) {
      return res.json({
        message: "Không có sản phẩm nào",
      });
    }

    // Lấy các loại sản phẩm của sản phẩm này
    const typeProductData: any = await TypeProductModel.find();
    const typeProducts: any = typeProductData.filter(
      (item: any) => item._doc.idPro == productId
    );

    // Tính toán giá và số lượng từ loại sản phẩm
    const minPrice = Math.min(...typeProducts.map((type) => type.price));
    const maxPrice = Math.max(...typeProducts.map((type) => type.price));

    let totalQuantity = 0;
    typeProducts.forEach((item: any) => {
      totalQuantity += item.quantity;
    });

    // Tạo một mảng để lưu thông tin của từng loại sản phẩm
    const typeProductInfo: any = [];
    // Duyệt qua từng loại sản phẩm
    for (const typeProduct of typeProducts) {
      // Tính tổng số lượng đã bán của loại sản phẩm hiện tại
      const soldQuantity = await OrderDetailModel.aggregate([
        {
          $match: { idprotype: typeProduct._doc._id.toString() }, // Lọc theo id loại sản phẩm
        },
        {
          $group: {
            _id: null,
            totalSold: { $sum: "$quantity" }, // Tính tổng số lượng đã bán
          },
        },
      ]);

      // Tính tổng số tiền đã bán của loại sản phẩm hiện tại
      const soldAmount = await OrderDetailModel.aggregate([
        {
          $match: { idprotype: typeProduct._doc._id.toString() }, // Lọc theo id loại sản phẩm
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$money" }, // Tính tổng số tiền đã bán
          },
        },
      ]);

      if (soldQuantity.length > 0) {
        // Đưa thông tin của loại sản phẩm vào mảng
        typeProductInfo.push({
          typeProductId: typeProduct._id,
          color: typeProduct.color,
          size: typeProduct.size,
          quantity: typeProduct.quantity,
          image: typeProduct.image,
          weight: typeProduct.weight,
          price: typeProduct.price,
          soldQuantity: soldQuantity.length > 0 ? soldQuantity[0].totalSold : 0,
          soldAmount: soldAmount.length > 0 ? soldAmount[0].totalAmount : 0,
        });
      }
    }

    return res.json({
      message: "Tìm sản phẩm thành công",
      data: product,
      minPrice: minPrice,
      maxPrice: maxPrice,
      totalQuantity: totalQuantity,
      typeProduct: typeProducts,
      typeProduct_bill: typeProductInfo,
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
      _sort = "createdAt",
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

    const data = await ProductModel.paginate({}, options);

    if (!data || data.docs.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    const newData = await Promise.all(
      data.docs.map(async (itemPro: any) => {
        try {
          const typeProducts = await TypeProductModel.find({
            idPro: itemPro._id,
          });

          // Tính toán số lượng sản phẩm đã bán và tổng số tiền đã bán
          const soldData = await OrderDetailModel.aggregate([
            {
              $match: { idpro: itemPro._id.toString() }, // Lọc theo id sản phẩm
            },
            {
              $group: {
                _id: null,
                totalSold: { $sum: "$quantity" }, // Tính tổng số lượng sản phẩm đã bán
                totalAmount: { $sum: "$money" }, // Tính tổng số tiền bán được
              },
            },
          ]);
          const comments = await CommentModel.find({ productId: itemPro._id });

          // Tính tổng số sao của các bình luận
          const totalStars = comments.reduce(
            (total, comment) => total + comment.star,
            0
          );

          // Tính trung bình số sao
          const averageStars =
            comments.length > 0 ? totalStars / comments.length : 0;

          // Nếu có dữ liệu về số lượng sản phẩm đã bán, gán cho thuộc tính soldQuantity, soldAmount
          const soldQuantity = soldData.length > 0 ? soldData[0].totalSold : 0;
          const soldAmount = soldData.length > 0 ? soldData[0].totalAmount : 0;

          const prices = typeProducts.map((product: any) => product.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const totalQuantity = typeProducts.reduce(
            (total: number, current: any) => total + current.quantity,
            0
          );

          const colors = Array.from(
            new Set(typeProducts.map((product: any) => product.color))
          );
          const sizes = Array.from(
            new Set(typeProducts.map((product: any) => product.size))
          );

          const averagePrice = Math.floor(
            prices.reduce(
              (total: number, current: number) => total + current,
              0
            ) / prices.length
          );

          const category = await CategoryModel.findById(itemPro.idCategory);

          return {
            ...itemPro._doc,
            totalQuantity,
            minPrice,
            maxPrice,
            averagePrice,
            colors,
            sizes,
            averageStars,
            categoryName: category ? category._doc.name : null,
            soldQuantity, // Thêm thuộc tính soldQuantity vào đối tượng sản phẩm
            soldAmount, // Thêm thuộc tính soldAmount vào đối tượng sản phẩm
          };
        } catch (error) {
          console.error("Error in processing product:", error);
          return null;
        }
      })
    );

    // Lọc ra các sản phẩm không thành công
    const filteredData = newData.filter((item) => item !== null);

    return res.status(200).json({
      message: "Gọi danh sách sản phẩm thành công!",
      datas: filteredData,
    });
  } catch (error) {
    console.error("Error in getAll:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

//phân trang, lọc, xắp xếp
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
export const deletePro = async (req, res: any) => {
  try {
    const id = req.params.id;
    const data = await ProductModel.findByIdAndUpdate(
      id,
      { ExistsInStock: false },
      { new: true }
    );

    console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "Xóa sản phẩm thất bại!",
      });
    }

    return res.status(200).json({
      message: "Xóa sản phẩm thành công!",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateView = async (req: any, res: any) => {
  try {
    const product = await ProductModel.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { view: 1 } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "View count updated successfully",
      product: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
