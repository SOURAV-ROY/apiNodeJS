const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for Elastic APM / Grafana
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: "error",
    message: err.message,
    name: err.name,
    code: err.code,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    source: err.source || "unknown",
    validationErrors: err.errors || null,
  };

  console.error(JSON.stringify(logEntry));

  if (err.name === "CastError") {
    // const message = `Resource Not Found with ID Of ${err.value}`;
    const message = "Resource Not Found";
    error = new ErrorResponse(message, 404);
  }

  //Mongoose Duplicate Key Error ****************************************
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  //Mongoose Validation Error *******************************************
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.errors || error.message || "Server error",
    source: error.source,
  });
};

module.exports = errorHandler;
