import joi from "joi";

export const productSchema = joi.object({});

export const typeProductSchema = joi.object({});

// // export const categoryProductSchema = joi.object().shape({
// //     name: joi.string().trim().required(),
// //     description: joi.string().required(),
// //     products: joi.array().of(
// //         joi
// //             .string()
// //             // regular expression để validate ObjectId.
// //             //
// //             .matches(/^[0-9a-fA-F]{24}$/)
// //             .required()
// //     ),
// // });
