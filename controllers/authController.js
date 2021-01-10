const path = require('path');
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async')
const User = require("../models/UserModel");

// @description     Register User
// @route           GET /api/v1/auth/register
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
