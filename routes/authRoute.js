const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/authController");

const router = express.Router();

// Protect Middleware ****************************************
const { protect } = require("../middleware/auth");

// Validation Middleware *************************************
const validate = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
} = require("../utils/validators/authValidator");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/logout", logout);
router.get("/me", protect, getMe);

router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
