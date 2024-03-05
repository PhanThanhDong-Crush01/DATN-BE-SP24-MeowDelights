import Joi from "joi";

const whyCancelOrderSchema = Joi.object({
  message: Joi.string().required().min(6).max(50),
});
export default whyCancelOrderSchema;
