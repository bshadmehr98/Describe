// const ErrorHandler = require('../utils/errorHandler');

const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      stackTrace: err.stack,
      message: err.message,
    });
  } else if (process.env.NODE_ENV === 'PRODUCTION') {
    // Generating custom error messages
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid ${err.path}`;
      err = new ErrorHandler(message, 400);
    }

    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((value) => value.message);
      err = new ErrorHandler(message, 400);
    }

    if (err.name === 'JsonWebTokenerror') {
      const message = 'Invalid token';
      err = new ErrorHandler(message, 400);
    }

    if (err.name === 'TokenExpiredError') {
      const message = 'Token expired';
      err = new ErrorHandler(message, 400);
    }

    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
};
