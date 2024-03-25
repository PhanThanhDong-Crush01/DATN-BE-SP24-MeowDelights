import Joi from "joi";
const contactSchema = Joi.object({
  name: Joi.string().required().min(6).max(50),
  phone: Joi.number().required(),
  email: Joi.string().email().required(),
  title: Joi.string().required().min(6).max(50),
  message: Joi.string().required().min(6).max(350),
  idNV: Joi.string(),
  statusOrder: Joi.boolean(),
  idOrder: Joi.string(),
  note: Joi.string(),
});
export default contactSchema;
