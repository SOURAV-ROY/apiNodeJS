const ErrorResponse = require("../utils/ErrorResponse");
const errorHandler = (err, req, res, next) => {
    let error = {...err}
    error.message = err.message;

    console.log(err.stack.red.bold.underline);

    //Mongoose bad ObjectID
    console.log(err.name.red.bold);
    if (err.name === "CastError") {
        const message = `Resource Not Found with ID Of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server error"
    });
}

module.exports = errorHandler;
