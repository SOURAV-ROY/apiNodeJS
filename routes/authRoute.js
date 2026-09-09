const express = require("express");
const expressRateLimit = require("express-rate-limit");
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  getCsrfToken,
} = require("../controllers/authController");

const router = express.Router();

// Specific rate limiter for sensitive authentication endpoints (e.g. forgot password)
const forgotPasswordLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs to prevent email bombing / enumeration
  validate: { trustProxy: false },
  message: {
    success: false,
    error:
      "Too many password reset requests from this IP, please try again after 15 minutes",
  },
});

// Rate limiter for authentication login endpoint to prevent brute-force attacks
const loginLimiter = expressRateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 login attempts per 10 minutes to mitigate credential stuffing
  validate: { trustProxy: false },
  message: {
    success: false,
    error:
      "Too many login attempts from this IP, please try again after 10 minutes",
  },
});

// Protect Middleware ****************************************
const { protect, validate } = require("../middleware");

// Validation Middleware *************************************
const {
  authValidator: {
    registerSchema,
    loginSchema,
    resetPasswordSchema,
    forgotPasswordSchema,
    updateDetailsSchema,
    updatePasswordSchema,
  },
} = require("../utils/validators");

router.post("/register", validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.get("/logout", logout);
router.get("/csrf-token", getCsrfToken);
router.get("/me", protect, getMe);

router.put(
  "/updatedetails",
  protect,
  validate(updateDetailsSchema),
  updateDetails,
);
router.put(
  "/updatepassword",
  protect,
  validate(updatePasswordSchema),
  updatePassword,
);

router.post(
  "/forgotpassword",
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);
router.put(
  "/resetpassword/:resettoken",
  validate(resetPasswordSchema),
  resetPassword,
);

module.exports = router;
