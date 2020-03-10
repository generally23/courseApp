const jwt = require('jsonwebtoken');
const Mailer = require('../utils/mailer');
const crypto = require('crypto');
const Account = require('../../models/accountModel');
const captureAsyncError = require('../utils/captureAsyncErrors');
const ApplicationError = require('../utils/AppError');

const signToken = id => jwt.sign({ id }, 'secret');

const setCookie = (name, value, res) => {
  res.cookie(name, value, {
    sameSite: true,
    maxAge: (Date.now() + 3600000 / 1000) / 1000,
    httpOnly: true
  });
};

exports.signup = captureAsyncError(async (req, res, next) => {
  // get account info
  const { firstname, lastname, email, password } = req.body;
  // find out if user already exist
  const accountExist = await Account.findOne({ email });
  // senf error if account exist
  if (accountExist) {
    return next(
      new ApplicationError('Account already exist. Try logging in instead', 400)
    );
  }
  // create new account
  const newAccount = await Account.create({
    firstname,
    lastname,
    email,
    password
  });
  console.log(newAccount);
  // generate token
  const token = signToken(newAccount.id);
  // send token as cookie
  setCookie('token', `Bearer ${token}`, res);
  // send account
  res.status(201).json(newAccount);
});

exports.signin = captureAsyncError(async (req, res, next) => {
  // get account email and password
  const { email, password } = req.body;
  // find account by email
  const account = await Account.findOne({ email });
  // send error if account is not found
  if (!account)
    return next(new ApplicationError('Account missing from our records', 404));
  // check if password is valid
  const isValidPassword = await account.verifyPassword(password);
  // send an error if password is invalid
  if (!isValidPassword)
    return next(new ApplicationError('Invalid email or password', 401));
  // sign a token
  const token = signToken(account.id);
  // set a cookie to the browser
  setCookie('token', `Bearer ${token}`, res);
  // send the account
  res.json(account);
});

exports.logout = captureAsyncError(async (req, res, next) => {
  res.cookie('token', '', {
    maxAge: Date.now() - 5000
  });
  res.status(204).json({});
});

exports.changePassword = captureAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (currentPassword === newPassword) {
    return next(
      new ApplicationError(
        'Your current password cannot be the same as your new password',
        400
      )
    );
  }
  const account = req.user;
  const isCurrentPasswordValid = await account.verifyPassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return next(
      new ApplicationError(
        'Invalid password enter your current password to change your password',
        401
      )
    );
  }
  account.password = newPassword;
  account.passwordChangedAt = Date.now();
  account.resetTokenExpiresIn = undefined;
  await account.save();
  return res.json(account);
});

exports.forgotPassword = captureAsyncError(async (req, res, next) => {
  // get email
  const { email } = req.body;
  // find account with email
  const account = await Account.findOne({ email });
  // send email only if account exists
  if (account) {
    const resetToken = await account.generatePasswordResetToken();
    const subject = 'Password reset request please act in the following hour';
    const text = `Please copy this link to your browser localhost/api/v1/accounts/reset-password/${resetToken}`;
    const mailer = new Mailer('rallygene0@gmail.com', email, subject, text);
    await mailer.send();
  }
  res.json({ message: 'An email was sent to your inbox' });
});

exports.resetPassword = captureAsyncError(async (req, res, next) => {
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  // find account with reset token
  const account = await Account.findOne({ passwordResetToken: resetTokenHash });
  // don't allow reset if token is invalid meaning no user found with resetTokenHash
  if (!account) return next('Reset token is invalid', 401);
  // don't allow reset if reset token has expired
  if (account.resetTokenExpiresIn.getTime() < Date.now())
    return next('Reset token has expired retry again', 401);
  // reset password
  account.password = req.body.password;
  account.passwordChangedAt = Date.now();
  account.resetTokenExpiresIn = undefined;
  account.passwordResetToken = undefined;
  // resave changes to DB
  await account.save();
  res.json(account);
});

exports.getAccount = captureAsyncError(async (req, res, next) => {
  res.json(req.user);
});

exports.updateInformation = captureAsyncError(async (req, res, next) => {
  const account = req.user;
  const allowedProperties = ['firstname', 'lastname', 'email'];
  const filterProperties = Object.keys(req.body).filter(key =>
    allowedProperties.includes(key)
  );
  filterProperties.forEach(prop => (account[prop] = req.body[prop]));
  await account.save();
  res.json(account);
});
