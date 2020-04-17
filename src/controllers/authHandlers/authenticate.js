const jwt = require('jsonwebtoken');
const ApplicationError = require('../../utils/AppError');
const captureAsyncError = require('../../utils/captureAsyncErrors');
const Account = require('../../models/accountModel');

module.exports = captureAsyncError(async (req, res, next) => {
  const encodedToken = req.cookies.token;
  if (!encodedToken) {
    return next(
      new ApplicationError(
        'You are not authenticated to this server. Please login to continue',
        401
      )
    );
  }
  const decodedToken = jwt.verify(
    encodedToken.replace('Bearer ', ''),
    process.env.JWT_SECRET
  );
  const account = await Account.findById(decodedToken.id).select('+password');
  if (!account) {
    return next(
      'You are not authenticated to this server. Please login to continue',
      401
    );
  }
  // make sure to invalidate tokens issued before the account changed password
  if (account.accountChangedPasswordAfterTokenIssued(decodedToken.iat)) {
    return next(
      new ApplicationError('Invalid authentication token. Please login again')
    );
  }
  req.user = account;
  next();
});
