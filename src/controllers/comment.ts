import { IProduct } from "../interface/IProduct";
import AuthModel from "../models/auth";
import CommentModel from "../models/comment";
import Comment from "../models/comment";
import ProductModel from "../models/product";
import TypeProductModel from "../models/typeProduct";
import { commentSchema } from "../validation/comment";
// xong comment
export const createComment = async (req, res) => {
  try {
    const { error } = commentSchema.validate(req.body.datas);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    // Trích xuất dữ liệu từ req.body
    const { userId, productId, productTypeId, billId, ...commentData } =
      req.body;

    // Kiểm tra tính hợp lệ của userId và productTypeId
    if (!userId || !productId || !productTypeId) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc: userId hoặc productTypeId hoặc .",
      });
    }

    const commentdatontai = await Comment.find({
      billId: billId,
      userId: userId,
      productId: productId,
      productTypeId: productTypeId,
    });
    console.log("🚀 ~ createComment ~ commentdatontai:", commentdatontai);
    if (commentdatontai.length > 0) {
      return res.status(400).json({
        message: "Bạn đã đánh giá sản phẩm này rồi.",
      });
    }

    // const existingComment = await Comment.findOne({ billId });

    // if (existingComment) {
    //   return res.status(400).json({
    //     message: "Đã tồn tại đánh giá cho idBill này.",
    //   });
    // }
    // Tạo mới đối tượng comment
    const data = await Comment.create({
      ...commentData,
      userId,
      productId,
      billId,
      productTypeId,
      ExistsInStock: true,
    });
    console.log(data);

    // Kiểm tra nếu không tạo được comment
    if (!data) {
      return res.status(404).json({
        message: "Không thể tạo đánh giá.",
      });
    }

    // Trả về phản hồi thành công
    return res.status(200).json({
      message: "Tạo đánh giá thành công.",
      data,
    });
  } catch (error) {
    // Xử lý các loại lỗi khác nhau
    return res.status(500).json({
      message: "Lỗi khi thêm đánh giá: " + error.message,
    });
  }
};

export const getAllComment = async (req, res) => {
  try {
    const data = await Comment.find({ ExistsInStock: true });
    if (!data) {
      return res.status(404).json({
        message: "lấy danh sách đánh giá thất bại",
      });
    }
    const reversedUsersWithStats = data.reverse();
    const updatedData = await Promise.all(
      data?.map(
        async (item: {
          _doc: any;
          productId: any;
          productTypeId: any;
          userId: any;
        }) => {
          const productInfo = await ProductModel.findById(item.productId);
          console.log(productInfo);
          const productTypeInfo = await TypeProductModel.findById(
            item.productTypeId
          );
          console.log(productTypeInfo);
          const userInfo = await AuthModel.findById(item?.userId);
          console.log(userInfo);
          return {
            ...item._doc,
            productInfo: productInfo,
            productTypeInfo: productTypeInfo,
            userInfo: userInfo,
          };
        }
      )
    );
    return res.status(200).json({
      message: "lấy danh sách đánh giá thành công",
      datas: updatedData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// export const getDetailComment = async (req, res) => {
//   try {
//     const data = await Comment.findById(req.params.id);
//     if (!data) {
//       return res.status(404).json({
//         message: "Lấy khuyến mại chi tiết thất bại",
//       });
//     }
//     const typeVoucher = await TypeVoucherModel.findById(data.idTypeVoucher);

//     return res.status(200).json({
//       message: "Lấy khuyến mại chi tiết thành công",
//       datas: { ...data._doc, typeVoucher: typeVoucher._doc.name },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };
export const removeComment = async (req, res) => {
  try {
    const data = await Comment.findByIdAndDelete(
      req.params.id,
      // { ExistsInStock: false },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        message: "Xóa đánh giá thất bại",
      });
    }
    return res.status(200).json({
      message: "Xóa đánh giá thành công",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const data = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({
        message: "Cập nhật đánh giá thất bại",
      });
    }
    return res.status(200).json({
      message: "Cập nhật đánh giá thành công",
      datas: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCommentsOfProduct = async (req, res) => {
  try {
    // Lấy id sản phẩm từ request params
    const productId = req.params.id;

    // Tìm tất cả các đánh giá của sản phẩm
    const comments: any = await Comment.find({
      productId: productId,
      ExistsInStock: true,
    });

    // Kiểm tra xem có bất kỳ đánh giá nào không
    // if (!comments || comments.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "Không tìm thấy đánh giá cho sản phẩm này." });
    // }

    // Duyệt qua từng đánh giá và lấy thông tin chi tiết của nó
    const commentDetails = await Promise.all(
      comments.map(async (comment: any) => {
        const product = await ProductModel.findById(comment?._doc?.productId);
        const productType = await TypeProductModel.findById(
          comment?._doc?.productTypeId
        );
        const user = await AuthModel.findById(comment.userId);
        if (!user) {
          return;
        }
        return {
          comment: {
            data: comment?._doc,
            product: product,
            productType: productType,
            user: {
              name: user?.name || "",
              email: user?.email || "",
              img: user?.imgUser || "",
            },
          },
        };
      })
    );

    return res.status(200).json({
      message: "Lấy tất cả các đánh giá của sản phẩm thành công.",
      comments: commentDetails,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getDetail = async (req, res) => {
  try {
    const data = await Comment.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Đánh giá không tồn tại",
      });
    }
    return res.status(200).json({
      message: "Chi tiết đánh giá",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
export const statisticsStar = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const data = await Comment.find({ productId });
    console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "lấy danh sách đánh giá thất bại",
      });
    }
    const productRatings = data.filter(
      (data) => data._doc.productId === productId
    );
    console.log(productRatings);

    // Kiểm tra xem sản phẩm có ít nhất một đánh giá không
    if (productRatings.length === 0) {
      return undefined; // Trả về undefined nếu không có đánh giá nào
    }

    // Tính tổng số sao
    const totalStars = productRatings.reduce(
      (total, current) => total + current.star,
      0
    );
    console.log(totalStars);

    // Tính trung bình xếp hạng
    const averageRating = (totalStars / productRatings.length).toFixed(1);

    // return averageRating;

    return res.status(200).json({
      message: "lấy danh sách đánh giá thành công",
      productId: productId,
      datas: averageRating,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const statisticsComment = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const data = await Comment.find({ productId });
    console.log(data);
    if (!data) {
      return res.status(404).json({
        message: "Lấy danh sách đánh giá thất bại",
      });
    }

    // Calculate the total number of comments for the product
    const totalComments = data.length;

    return res.status(200).json({
      message: "Lấy danh sách đánh giá thành công",
      productId: productId,
      totalComments: totalComments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getCheckComment = async (req, res) => {
  try {
    const { userId, productId, productTypeId } = req.params;
    // Tìm kiếm đánh giá dựa trên iduser, idpro, idprotype
    const comment = await Comment.findOne({ userId, productId, productTypeId });

    // Nếu đã có đánh giá, trả về đánh gián
    if (comment) {
      return { hasComment: true, comment };
    }

    // Nếu chưa đánh giá, trả về null
    return { hasComment: false, comment: null };
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Hàm lấy tất cả các comment có cùng idbill

export const getAllCommentsByBillId = async (req, res) => {
  try {
    // Lấy id sản phẩm từ request params
    const billId = req.params.id;

    // Tìm tất cả các đánh giá của sản phẩm
    const comments: any = await Comment.find({
      billId: billId,
      ExistsInStock: true,
    });

    // Kiểm tra xem có bất kỳ đánh giá nào không
    // if (!comments || comments.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "Không tìm thấy đánh giá cho sản phẩm này." });
    // }

    // Duyệt qua từng đánh giá và lấy thông tin chi tiết của nó
    // const commentDetails = await Promise.all(
    //   comments.map(async (comment: any) => {
    //     const product = await ProductModel.findById(comment?._doc?.productId);
    //     const productType = await TypeProductModel.findById(
    //       comment?._doc?.productTypeId
    //     );
    //     const user = await AuthModel.findById(comment.userId);
    //     if (!user) {
    //       return;
    //     }
    //     return {
    //       comment: {
    //         data: comment?._doc,
    //         product: product,
    //         productType: productType,
    //         user: {
    //           name: user?.name || "",
    //           email: user?.email || "",
    //           img: user?.imgUser || "",
    //         },
    //       },
    //     };
    //   })
    // );

    return res.status(200).json({
      message: "Lấy tất cả các đánh giá có cùng 1 bill.",
      comments: comments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
