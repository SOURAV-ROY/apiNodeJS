const path = require('path');
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async')
const User = require("../models/UserModel");

// @description     Register User
// @route           POST /api/v1/auth/register
// @access          Public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    //Create user *****************************************
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Create token ******************************************
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token
    })
});

// @description     Login User
// @route           POST /api/v1/auth/login
// @access          Public
exports.login = asyncHandler(async (req, res, next) => {

    const {email, password} = req.body;
    // Validate Email & Password *******************************
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check For User *******************************************************
    const user = await User.findOne({email}).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    //Check if password matches *********************************************
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Create token *********************************************************
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token
    })
});
