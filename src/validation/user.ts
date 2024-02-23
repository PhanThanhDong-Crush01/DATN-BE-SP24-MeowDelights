import joi from "joi";

// export const getUserSchema = joi.object({
//   name: joi.string(),
//   email: joi.string().email().required().messages({
//     "string.email": "Email không đúng định dạng",
//     "string.empty": "Email không được để trống",
//     "any.required": "Trường email là bắt buộc",
//   }),
//   password: joi.string().required().min(6).messages({
//     "string.min": "Password phải có ít nhất {#limit} ký tự",
//     "string.empty": "Password không được để trống",
//     "any.required": "Trường Password là bắt buộc",
//   }),
//   confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
//     "any.only": "Password không khớp",
//     "any.required": "Trường confirm password là bắt buộc",
//   }),
// });
export const updateUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required().messages({
    "string.email": "Email không đúng định dạng",
    "string.empty": "Email không được để trống",
    "any.required": "Trường email là bắt buộc",
  }),
  phone: joi.string().messages({
    "string.pattern.base": "Số điện thoại không đúng định dạng",
    "string.empty": "Số điện thoại không được để trống",
    "any.required": "Trường số điện thoại là bắt buộc",
  }),
  address: joi.string().required().messages({
    "string.empty": "Địa chỉ không được để trống",
  }),
  imgUser: joi.string().required().messages({
    "string.empty": "Hình ảnh của người dùng không được để trống",
    "any.required": "Trường hình ảnh của người dùng là bắt buộc",
  }),
  age: joi.number().required().messages({
    "date.base": "Ngày sinh không đúng định dạng",
    "any.required": "Trường Ngày Sinh là bắt buộc",
  }),
  gender: joi.boolean().required().messages({
    "any.required": "Trường Giới tính là Bắt Buộc",
  }),
  authorized_accounts: joi.string(),
});
