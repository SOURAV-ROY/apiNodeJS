const Joi = require("joi");

const bootcampSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(500).required(),
  website: Joi.string().uri().optional(),
  phone: Joi.string().max(20).optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().required(),
  careers: Joi.array()
    .items(
      Joi.string().valid(
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ),
    )
    .required(),
  housing: Joi.boolean().optional(),
  jobAssistance: Joi.boolean().optional(),
  jobGuarantee: Joi.boolean().optional(),
  acceptGi: Joi.boolean().optional(),
}).unknown(true);

module.exports = {
  bootcampSchema,
};
