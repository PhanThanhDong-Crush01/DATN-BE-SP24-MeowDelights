import Joi from "joi";
export const BillSchema = Joi.object({
  iduser: Joi.string().required(),
  money: Joi.number().required().min(0),
  date: Joi.string().required(),
  adress: Joi.string().required(),
  tel: Joi.string().required(),
  idvc: Joi.string().required(),
  paymentmethods: Joi.string().required(),
  paymentstatus: Joi.string().required(),
  orderstatus: Joi.string().required(),
});
const BillDetailSchema = Joi.object({
  idbill: Joi.object().required(),
  iduser: null,
  idpro: Joi.string().required(),
  idprotype: Joi.string().required(),
  quantity: Joi.number().required().min(0),
  money: Joi.number().required().min(0),
});
export default BillDetailSchema;
