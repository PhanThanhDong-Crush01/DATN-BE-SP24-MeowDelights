import Joi from "joi";

const voucherSchema = Joi.object({
  codevc: Joi.string().required(),
  status: Joi.string().required(),
  decrease: Joi.number().required().min(0),
  expiry: Joi.string().required(),
  conditions: Joi.string().required(),
});

export default voucherSchema;
