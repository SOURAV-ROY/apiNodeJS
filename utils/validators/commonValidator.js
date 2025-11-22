const Joi = require("joi");

const idSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const querySchema = Joi.object({
  select: Joi.string().optional(),
  sort: Joi.string().optional(),
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
}).unknown(true); // Allow other query params for filtering

module.exports = {
  idSchema,
  querySchema,
};
