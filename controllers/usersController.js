const { ErrorResponse } = require("../utils");
const { asyncHandler } = require("../middleware");
const { User } = require("../models");

// @description     Get All Users
// @route           GET /api/v1/users
// @access          Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @description     Get Single User
// @route           GET /api/v1/users/:id
// @access          Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @description     Create user
// @route           POST /api/v1/users
// @access          Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @description     Update user
// @route           PUT /api/v1/users/:id
// @access          Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @description     Delete user
// @route           DELETE /api/v1/users/:id
// @access          Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // Security control: Prevent admin from self-deleting via user management route
  if (req.params.id === req.user.id) {
    return next(
      new ErrorResponse(
        "Admin cannot delete their own account via user management",
        400,
      ),
    );
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
