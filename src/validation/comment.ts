import joi from "joi";

export const commentSchema = joi.object({
  star: joi.number().required().min(1).messages({
    "number.empty": "mời chọn ngô sao",
    "any.required": "mời chọn ngôi sao",
  }),
  title: joi.string().required().messages({
    "string.empty": "Tiêu đề không được để trống",
    "any.required": "Tiêu đề là bắt buộc",
  }),
  comment: joi.string().required().min(6).messages({
    "string.min": "Bình luận phải có ít nhất 6 ký tự",
    "string.empty": "Bình luận không được để trống",
    "any.required": "Bình luận là bắt buộc",
  }),
  img: joi.string().required().messages({
    "string.empty": "Hình ảnh không được để trống",
    "any.required": "Hình ảnh là bắt buộc",
  }),
});
