import Joi from "joi";
export const BillSchema = Joi.object({
  iduser: Joi.object().required(),
  money: Joi.number().required().min(0),
  date: Joi.date().required(),
  adress: Joi.string().required(),
  tel: Joi.number().required(),
  idvc: Joi.string(),
  paymentmethods: Joi.string().required(),
  paymentstatus: Joi.string().required(),
  orderstatus: Joi.string().required(),
});
const BillDetailSchema = Joi.object({
  idbill: Joi.object(),
  iduser: Joi.object(),
  idpro: Joi.object().required(),
  idprotype: Joi.object().required(),
  quantity: Joi.number().required().min(0),
  money: Joi.number().min(0),
});
export default BillDetailSchema;
