import Joi from "joi";

export const categoryValid = Joi.object({
    name: Joi.string().required().min(6).messages({
        "string.empty": `"Danh mục" không được bỏ trống`,
        "any.required": `"Danh mục" là trường bắt buộc`,
        "string.min": `"Danh mục" phải có ít nhất 6 kí tự`
    })
    // slug: Joi.string().required().min(3).max(255)
})