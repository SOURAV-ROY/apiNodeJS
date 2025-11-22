class ErrorResponse extends Error {
  constructor(message, statusCode, errors = null, source = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.source = source;
  }
}

module.exports = ErrorResponse;
