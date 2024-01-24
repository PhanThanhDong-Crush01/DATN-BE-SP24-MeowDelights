import Joi from "joi";
const typeVoucherSchema = Joi.object({
  name: Joi.string().required().min(6).max(50),
});
export default typeVoucherSchema;
