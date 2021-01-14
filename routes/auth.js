const express = require('express');
const {register, login, getMe, forgotPassword, resetPassword} = require('../controllers/authController');

const router = express.Router();

//Protect Middleware ****************************************************
const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
