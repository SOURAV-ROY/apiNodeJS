const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "publisher", "admin").required(),
}).unknown(true);

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("user", "publisher", "admin").optional(),
}).unknown(true);

module.exports = {
  createUserSchema,
  updateUserSchema,
};
