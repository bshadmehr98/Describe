const express = require('express');
const {
  registerUser,
  loginUser,
  sendResetPasswordEmail,
  resetPassword} = require('../controllers/userController');

// eslint-disable-next-line new-cap
const router = express.Router();

router.route('/auth/register')
    .post(registerUser);

router.route('/auth/login')
    .post(loginUser);

router.route('/auth/reset')
    .post(sendResetPasswordEmail);

router.route('/auth/reset/finish')
    .post(resetPassword);

module.exports = router;
