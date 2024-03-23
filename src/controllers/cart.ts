import TypeProductModel from "../models/typeProduct";
import ProductModel from "../models/product";
import { OrderDetailModel } from "../models/bill";

export const create = async (req: any, res: any) => {
  try {
    const cartItem = req.body;
    const iduser = cartItem.iduser;
    const idpro = cartItem.idpro;
    const idprotype = cartItem.idprotype;
    const money = cartItem.money;
    const quantity = cartItem.quantity;
    const productOne: any = await ProductModel.findById(idpro);
    const priceTypePro: any = await TypeProductModel.findById(idprotype);
    console.log("🚀 ~ create ~ priceTypePro:", priceTypePro);
    const namePro = productOne.name;
    const nameTypePro = priceTypePro.color + " - " + priceTypePro.size;
    const imageTypePro = priceTypePro.image;

    const userCartItem: any = await OrderDetailModel.findOne({
      iduser: iduser,
      idpro: idpro,
      idprotype: idprotype,
    });

    // cheeck số lượng khi thêm vào giỏ hàng

    if (userCartItem) {
      const productInStock = priceTypePro.quantity;
      if (quantity + userCartItem?.quantity > productInStock) {
        return res.status(400).json({
          message: "Số lượng vượt quá số lượng có sẵn",
        });
      }

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
        namePro: namePro,
        nameTypePro: nameTypePro,
        imageTypePro: imageTypePro,
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
      message: `Error in create cart item: ${error.message}`,
    });
  }
};

export const update = async (req: any, res: any) => {
  try {
    const id = req.body._id;
    const quantity = req.body.quantity;

    const userCartItem = await OrderDetailModel.findById(id);
    const TypePro: any = await TypeProductModel.findById(
      userCartItem.idprotype
    );
    if (TypePro.quantity <= quantity) {
      return res.status(500).json({
        message: "Số lượng sản phẩm tồn kho không đủ!",
      });
    }

    const newMoney = quantity * TypePro.price;
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
      message: "Internal Server Error: " + error.message,
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
    var total = 0;
    const updatedCart = await Promise.all(
      userCart.map(async (cartItem) => {
        const productItem = await ProductModel.findById(cartItem.idpro);
        const productTypeItem = await TypeProductModel.findById(
          cartItem.idprotype
        );
        total += cartItem.money;
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
      totalAmount: total,
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

export const removeCartUser = async (req: any, res: any) => {
  try {
    const cartUser = await OrderDetailModel.find({
      iduser: req.params.id.toString(),
    });
    cartUser.map(async (item: any) => {
      await OrderDetailModel.findByIdAndDelete(item?._id);
    });

    return res.status(201).json({
      message: "Xoá sản phẩm trong giỏ hàng của bạn thành công",
    });
  } catch (error) {
    console.error(`Error in create cart item: ${error.message}`);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
