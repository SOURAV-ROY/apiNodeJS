const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/UserModel');

//Protect Routes ************************************
exports.protect = asyncHandler(async (req, res, next) => {

    let token;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        //Set Token from Bearer token In Header ****************
        token = req.headers.authorization.split(' ')[1];
        //Set Token From Cookie ********************************
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token Exits ***********************************************
    if (!token) {
        return next(new ErrorResponse('Not Authorized to access this route', 401));
    }
    try {
        // Verify Token ****************************************
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();

    } catch (errors) {
        return next(new ErrorResponse('Not Authorized to access this route', 401));
    }
});

// Grand Access to specific roles **************************************************
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User Role ${req.user.role} is Not Authorized to access this route`, 403));
        }
        next();
    };
};
