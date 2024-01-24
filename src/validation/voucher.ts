import Joi from "joi";

const voucherSchema = Joi.object({
  codevc: Joi.number().required().min(0),
  status: Joi.string().required(),
  decrease: Joi.number().required().min(0),
  expiry: Joi.string().required(),
  conditions: Joi.number().required().min(0),
});

export default voucherSchema;
