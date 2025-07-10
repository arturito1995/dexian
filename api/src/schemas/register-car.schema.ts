import * as Joi from "joi";

export const registerCarSchema = Joi.object({
  make: Joi.string().trim().min(1).max(50).required(),
  model: Joi.string().trim().min(1).max(50).required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  color: Joi.string().trim().min(1).max(30).required(),
  price: Joi.number().positive().precision(2).required(),
  mileage: Joi.number().integer().min(0).required(),
  package: Joi.string().required(),
});
