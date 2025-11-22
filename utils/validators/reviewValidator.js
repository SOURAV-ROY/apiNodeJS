const Joi = require("joi");

const createReviewSchema = Joi.object({
  title: Joi.string().max(100).required(),
  text: Joi.string().required(),
  rating: Joi.number().min(1).max(10).required(),
  bootcamp: Joi.string().hex().length(24).required(),
}).unknown(true);

const updateReviewSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  text: Joi.string().optional(),
  rating: Joi.number().min(1).max(10).optional(),
}).unknown(true);

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};
