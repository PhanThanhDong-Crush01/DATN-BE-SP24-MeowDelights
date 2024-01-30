import BillDetailSchema from "../validation/bill"; // Import BillDetailSchema from the correct path
import OrderDetailModel from "../models/billdetail";
import TypeProductModel from "../models/typeProduct";
import ProductModel from "../models/product";

export const create = async (req: any, res: any) => {
  try {
    const cartItem = req.body;
    const iduser = cartItem.iduser; // Correctly access iduser from cartItem
    const idpro = cartItem.idpro; // Correctly access idpro from cartItem
    const idprotype = cartItem.idprotype; // Correctly access idprotype from cartItem
    const quantity = cartItem.quantity; // Correctly access quantity from cartItem

    const { error } = BillDetailSchema.validate(cartItem);
    if (error) {
      return res.status(400).json({
        message: `Validation error: ${error.details[0].message}`,
      });
    }

    const priceTypePro: any = await TypeProductModel.findById(idprotype);
    if (!priceTypePro) {
      return res.status(404).json({
        message: "Không có loại sản phẩm này",
      });
    }
    const userCartItem: any = await OrderDetailModel.findOne({
      iduser: iduser,
      idpro: idpro,
      idprotype: idprotype,
    });

    if (userCartItem) {
      const upQuantity = quantity + userCartItem.quantity;
      var upMoney: number;
      if (userCartItem.money) {
        upMoney = quantity * priceTypePro.price + userCartItem.money;
      } else {
        upMoney = quantity * priceTypePro.price;
      }
      const updateQuantity = await OrderDetailModel.findByIdAndUpdate(
        userCartItem._id,
        { quantity: upQuantity, money: upMoney },
        { new: true }
      );

      if (updateQuantity) {
        return res.status(200).json({
          message: "Cập nhật số lượng của sản phẩm trong giỏ hàng thành công",
          data: updateQuantity,
        });
      }
    } else {
      const money = quantity * priceTypePro.price;
      const newCartItem = {
        iduser: iduser,
        idpro: idpro,
        idprotype: idprotype,
        quantity: quantity,
        money: money,
      };

      const newUserCartItem = await OrderDetailModel.create(newCartItem);
      if (!newUserCartItem) {
        return res.status(500).json({
          message: "Thâm sản phẩm vào giỏ hàng không thành công",
        });
      }

      return res.status(201).json({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data: newUserCartItem,
      });
    }
  } catch (error) {
    console.error(`Error in create cart item: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const update = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const quantity = req.body.quantity;

    const userCartItem = await OrderDetailModel.findById(id);
    const priceTypePro: any = await TypeProductModel.findById(
      userCartItem.idprotype
    );

    const newMoney = quantity * priceTypePro.price;
    const updateCartItem = await OrderDetailModel.findByIdAndUpdate(
      id,
      { quantity: quantity, money: newMoney },
      { new: true }
    );
    return res.status(200).json({
      message: "Cập nhật sản phẩm trong giỏ hàng của bạn thành công",
      data: updateCartItem,
    });
  } catch (error) {
    console.error(`Error in create cart item: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllCartOfUser = async (req: any, res: any) => {
  try {
    const iduser = req.params.id;

    const userCart = await OrderDetailModel.find({ iduser: iduser });
    if (!userCart) {
      return res.status(200).json({
        message: "In ra giỏ hàng của bạn thất bại",
      });
    }

    // Sử dụng Promise.all để chờ đợi hoàn thành của tất cả các hàm bất đồng bộ
    const updatedCart = await Promise.all(
      userCart.map(async (cartItem) => {
        const productItem = await ProductModel.findById(cartItem.idpro);
        const productTypeItem = await TypeProductModel.findById(
          cartItem.idprotype
        );
        return {
          ...cartItem.toObject(), // Chuyển đổi cartItem thành một plain JavaScript object
          product: productItem,
          typeProduct: productTypeItem,
        };
      })
    );

    return res.status(200).json({
      message: "In ra giỏ hàng của bạn thành công",
      data: updatedCart,
    });
  } catch (error) {
    console.error(`Error in create cart item: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getOne = async (req: any, res: any) => {
  try {
    const id = req.params.id;

    const userCartItem: any = await OrderDetailModel.findById(id);
    console.log("🚀 ~ getOne ~ userCartItem:", userCartItem._doc);
    if (!userCartItem) {
      return res.status(200).json({
        message: "In ra giỏ hàng của bạn thất bại",
      });
    }

    const productItem = await ProductModel.findById(userCartItem.idpro);
    const productTypeItem = await TypeProductModel.findById(
      userCartItem.idprotype
    );

    return res.status(200).json({
      message: "In ra giỏ hàng của bạn thành công",
      data: {
        ...userCartItem._doc,
        product: productItem,
        typeProduct: productTypeItem,
      },
    });
  } catch (error) {
    console.error(`Error in create cart item: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const remove = async (req: any, res: any) => {
  try {
    await OrderDetailModel.findByIdAndDelete(req.params.id);
    return res.status(201).json({
      message: "Xoá sản phẩm trong giỏ hàng của bạn thành công",
    });
  } catch (error) {
    console.error(`Error in create cart item: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
