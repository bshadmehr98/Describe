const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const User = require('../models/user');

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return next(new ErrorHandler('Invalid authorization token', 401));
  }

  const tokenParts = bearer.split(' ');
  if (tokenParts.length < 2) {
    return next(new ErrorHandler('Invalid authorization token', 401));
  }

  const decode = jwt.verify(tokenParts[1], process.env.JWT_SECRET);

  const user = await User.findById(decode.id);
  if (!user) {
    return next(new ErrorHandler('User not found', 401));
  }

  req.user = user;

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this recource`, 403));
    }
    next();
  };
};
