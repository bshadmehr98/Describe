/**
 * Creates a error object.
**/
class ErrorHandler extends Error {
  /**
     * Error constroctur.
     * @param {string} message The first number.
     * @param {int} statusCode The second number.
  **/
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
