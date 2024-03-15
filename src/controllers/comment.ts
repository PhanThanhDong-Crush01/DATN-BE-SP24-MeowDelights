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
    const { userId, productId, productTypeId, ...commentData } = req.body;

    // Kiểm tra tính hợp lệ của userId và productTypeId
    if (!userId || !productId || !productTypeId) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc: userId hoặc productTypeId hoặc .",
      });
    }

    // Kiểm tra tính hợp lệ của userId và productTypeId so với cơ sở dữ liệu,
    // ví dụ: kiểm tra xem userId có tồn tại không.

    // Tạo mới đối tượng comment
    const data = await Comment.create({
      ...commentData,
      userId,
      productId,
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
    const data = await Comment.find({
      ExistsInStock: true,
    });
    if (!data) {
      return res.status(404).json({
        message: "lấy danh sách đánh giá thất bại",
      });
    }
    return res.status(200).json({
      message: "lấy danh sách đánh giá thành công",
      datas: data,
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
    const data = await Comment.findByIdAndUpdate(
      req.params.id,
      { ExistsInStock: false },
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
    const comments: any = await Comment.find({ productId: productId });

    // Kiểm tra xem có bất kỳ đánh giá nào không
    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đánh giá cho sản phẩm này." });
    }

    // Duyệt qua từng đánh giá và lấy thông tin chi tiết của nó
    const commentDetails = await Promise.all(
      comments.map(async (comment: any) => {
        console.log("🚀 ~ comments.map ~ comment:", comment?._doc);

        const product = await ProductModel.findById(comment?._doc?.productId);
        const productType = await TypeProductModel.findById(
          comment?._doc?.productTypeId
        );
        const user = await AuthModel.findById(comment.userId);
        if (!user) {
          // Xử lý trường hợp user không tồn tại
          return res
            .status(404)
            .json({ message: "Không tìm thấy người dùng." });
        }
        return {
          comment: {
            data: comment?._doc,
            product: product,
            productType: productType,
            user: {
              name: user.name || "",
              email: user.email || "",
              img: user.imgUser || "",
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
    const data = await Comment.findById(req.params.id, {
      ExistsInStock: true,
    });
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
