const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "publisher"),
}).unknown(true);

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(true);

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
}).unknown(true);

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
};
