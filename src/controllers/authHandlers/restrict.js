const ApplicationError = require('../../utils/AppError');

module.exports = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next(
        new ApplicationError(
          'You are forbidden from taking these kind of actions',
          403
        )
      );
    }
    next();
  };
};
