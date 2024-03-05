import Joi from "joi";

const voucherSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.boolean().required(),
  quantity: Joi.number().required(),
  decrease: Joi.number().required().min(0),
  expiry: Joi.string().required(),
  conditions: Joi.number().required(),
  idTypeVoucher: Joi.string().required(),
});

export default voucherSchema;
