const Joi = require("joi");

// Security control: Password complexity regex requiring at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+=\[\]{}|:<>,.~]).{6,}$/;
const passwordErrorMessage =
  "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character";

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base": passwordErrorMessage,
  }),
  role: Joi.string().valid("user", "publisher"),
}).unknown(true);

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(true);

const resetPasswordSchema = Joi.object({
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base": passwordErrorMessage,
  }),
}).unknown(true);

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
}).unknown(true);

const updateDetailsSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
}).unknown(true);

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base": passwordErrorMessage,
  }),
}).unknown(true);

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  updateDetailsSchema,
  updatePasswordSchema,
};
