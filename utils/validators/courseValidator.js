const Joi = require("joi");

const createCourseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  weeks: Joi.string().required(),
  tuition: Joi.number().required(),
  minimumSkill: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .required(),
  scholarshipAvailable: Joi.boolean().optional(),
  bootcamp: Joi.string().hex().length(24).required(),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  weeks: Joi.string().optional(),
  tuition: Joi.number().optional(),
  minimumSkill: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .optional(),
  scholarshipAvailable: Joi.boolean().optional(),
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
};
