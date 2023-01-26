const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');


exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const {name, email, password} = req.body;
  let user = await User.create(
      {name: name, email: email, password: password});

  user = await User.findById(user._id).select('-password');
  const token = user.getJWT();

  res.status(201).json({
    success: true,
    user: user,
    token: token,
  });
});

exports.sendResetPasswordEmail = catchAsyncErrors(async (req, res, next) => {
  const {email} = req.body;
  const user = await User.findOne({email: email});
  if (!user) {
    res.status(200).json({
      success: true,
      message: 'If youre email exists in our database,' +
      'We have sent you a recovery link!',
    });
    return;
  }

  const resetToken = user.getResetPasswordToken();
  const resetUrl = `${req.protocol}://${req.get('host')}/api/vi/auth/reset/${resetToken}`;
  const message = `You can reset your password with\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Describe reset password',
      message: message,
    });

    res.status(200).json({
      success: true,
      message: 'If youre email exists in our database,' +
      'We have sent you a recovery link!',
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'An error eccured while trying to send email',
    });
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const {password, token} = req.body;

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id);
  if (!user) {
    res.status(400).json({
      success: true,
      message: 'Invalid reset link',
    });
    return;
  }

  user.password = password;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed',
  });
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Email and Password are required!', 400));
  }

  const user = await User.findOne({email: email}).select('+password');
  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  const isPasswordMached = await user.comparePassword(password);
  if (!isPasswordMached) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  const token = user.getJWT();

  res.status(200).json({
    success: true,
    user: user,
    token: token,
  });
});
