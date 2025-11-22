const ErrorResponse = require("../utils/ErrorResponse");

const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path.join(".")] = detail.message.replace(/"/g, "");
      });
      return next(new ErrorResponse("Validation Error", 400, errors, property));
    }

    next();
  };

module.exports = validate;
