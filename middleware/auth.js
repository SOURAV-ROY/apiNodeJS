const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/UserModel");

//Protect Routes ************************************
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Set Token from Bearer token In Header ****************
    token = req.headers.authorization.split(" ")[1];
    //Set Token From Cookie ********************************
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token Exits ***********************************************
  if (!token) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
  try {
    // Verify Token ****************************************
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    // Bolt Optimization: Chain .lean() to bypass Mongoose document hydration for user lookup in protect middleware.
    // This returns plain JavaScript objects and significantly reduces CPU and memory overhead on every protected endpoint request.
    req.user = await User.findById(decoded.id).lean();

    // Verify user still exists in database (defense in depth & prevents DoS on req.user property accesses)
    if (!req.user) {
      return next(
        new ErrorResponse("Not Authorized to access this route", 401),
      );
    }

    // Ensure req.user.id exists as a string property matching standard Mongoose virtual behavior
    req.user.id = req.user._id.toString();

    next();
  } catch (errors) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
});

// Grand Access to specific roles **************************************************
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User Role ${req.user.role} is Not Authorized to access this route`,
          403,
        ),
      );
    }
    next();
  };
};
