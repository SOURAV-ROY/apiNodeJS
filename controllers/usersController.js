const asyncHandler = require('../middleware/async')
const User = require("../models/UserModel");

// @description     Get All Users
// @route           POST /api/v1/auth/users
// @access          Private/Admin
exports.getUsers = asyncHandler(async (req, res,next) => {
    res.status(200).json(res.advancedResults);
});

// @description     Get Single Users
// @route           POST /api/v1/auth/users/:id
// @access          Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @description     Create user
// @route           POST /api/v1/auth/users
// @access          Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

// @description     Update user
// @route           PUT /api/v1/auth/users/:id
// @access          Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @description     Delete user
// @route           DELETE /api/v1/auth/users/:id
// @access          Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});
