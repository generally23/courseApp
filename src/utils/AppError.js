class ApplicationError extends Error {
  constructor(msg, statusCode) {
    super();
    this.msg = msg;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApplicationError;
