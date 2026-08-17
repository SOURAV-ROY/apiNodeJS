const crypto = require("crypto");
const { ErrorResponse, sendMail } = require("../utils");
const { asyncHandler } = require("../middleware");
const { User } = require("../models");
const config = require("../config/config.json");

// @description     Register User
// @route           POST /api/v1/auth/register
// @access          Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Create user ************************************************
  // Public registration strictly defaults role to "user" to prevent privilege escalation
  const user = await User.create({
    name,
    email,
    password,
  });

  // Create token ***********************************************
  sendTokenResponse(user, 200, res);

  // const token = user.getSignedJwtToken();
  //
  // res.status(200).json({
  //     success: true,
  //     token
  // })
});

// @description     Login User
// @route           POST /api/v1/auth/login
// @access          Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate Email & Password **************************************************
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check For User *************************************************************
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //Check if password matches ***************************************************
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // Create token ***************************************************************
  sendTokenResponse(user, 200, res);
});

// @description     Logout User / Clear Cookie
// @route           GET /api/v1/auth/logout
// @access          Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @description     Get User
// @route           GET /api/v1/auth/me
// @access          Private
exports.getMe = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @description     Update User details
// @route           PUT /api/v1/auth/updatedetails
// @access          Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  let user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @description     Update User Password
// @route           PUT /api/v1/auth/updatePassword
// @access          Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //Check Current Password **********************************************
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is Incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @description     Forgot Password
// @route           GET /api/v1/auth/forgotPassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is No User with this email", 404));
  }

  // Get reset token *********************************************************
  const resetToken = user.getResetPasswordToken();
  // console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  // Create reset url ********************************************************
  const resetUrl = `${req.protocol}://${config.hostname}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has request the reset password 
    please make the put request to: \n ${resetUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Please Reset Token",
      message,
    });
    res.status(200).json({ success: true, data: "Send Email" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be send", 500));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @description     Reset Password
// @route           PUT /api/v1/auth/resetpassword/:resettoken
// @access          Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token ***********************************************
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  //Set Password **********************************************************
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Create token *********************************************************
  sendTokenResponse(user, 200, res);
});

// @description     Get CSRF Token
// @route           GET /api/v1/auth/csrf-token
// @access          Public
exports.getCsrfToken = (req, res, next) => {
  res.status(200).json({ success: true, csrfToken: res.locals._csrf });
};

//Get token from from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Cookie Token *********************************************************
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
