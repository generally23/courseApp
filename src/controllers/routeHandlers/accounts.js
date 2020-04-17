const Mailer = require('../../utils/mailer');
const crypto = require('crypto');
const Account = require('../../models/accountModel');
const captureAsyncError = require('../../utils/captureAsyncErrors');
const ApplicationError = require('../../utils/AppError');
const sharp = require('sharp');
const { signToken } = require('../../utils');
const { assign, assignIgnore } = require('../../utils');

const setCookie = (name, value, res) => {
  res.cookie(name, value, {
    sameSite: true,
    maxAge: (Date.now() + 3600000 / 1000) / 1000,
    httpOnly: true,
  });
};

exports.signup = captureAsyncError(async (req, res, next) => {
  // get account info
  const { firstname, lastname, email, password } = req.body;
  // find out if user already exist
  const accountExist = await Account.findOne({
    email,
  });
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
    password,
  });
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
  const account = await Account.findOne(
    {
      email,
    },
    { password: 1 }
  );
  // send error if account is not found
  if (!account) {
    return next(new ApplicationError('Account missing from our records', 404));
  }
  // check if password is valid
  const isValidPassword = await account.verifyPassword(password);
  // send an error if password is invalid
  if (!isValidPassword) {
    return next(new ApplicationError('Invalid email or password', 401));
  }
  // sign a token
  const token = signToken(account.id);
  // set a cookie to the browser
  setCookie('token', `Bearer ${token}`, res);
  // send the account
  res.json(account);
});

exports.logout = captureAsyncError(async (req, res, next) => {
  res.cookie('token', '', {
    maxAge: Date.now() - 5000,
  });
  res.status(204).json();
});

exports.changePassword = captureAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const account = req.user;

  const isCurrentPasswordValid = await account.verifyPassword(currentPassword);

  if (!isCurrentPasswordValid) {
    return next(
      new ApplicationError(
        'Invalid password. Enter your current password to change your password',
        401
      )
    );
  }

  if (currentPassword === newPassword) {
    return next(
      new ApplicationError(
        'Your current password cannot be the same as your new password',
        400
      )
    );
  }

  assignIgnore(
    {
      password: newPassword,
      passwordChangedAt: Date.now(),
      resetTokenExpiresIn: undefined,
    },
    account
  );

  await account.save();

  return res.json(account);
});

exports.forgotPassword = captureAsyncError(async (req, res, next) => {
  // get email
  const { email } = req.body;
  // find account with email
  const account = await Account.findOne({
    email,
  }).select('+resetToken, +resetTokenExpiresIn');
  // send email only if account exists
  if (account) {
    const resetToken = await account.generatePasswordResetToken();
    const resetUrl = `${req.protocol}://${req.hostname}/api/v1/accounts/reset-password/${resetToken}`;
    const subject = 'Password reset request please act in the following hour';
    const text = `Please copy this link to your browser ${resetUrl}`;
    const mailer = new Mailer('rallygene0@gmail.com', email, subject, text);
    await mailer.send();
  }
  res.json({
    message: 'An email was sent to your inbox. Check it to reset your password',
  });
});

exports.resetPassword = captureAsyncError(async (req, res, next) => {
  // hash the incoming unhashed reset token from the url
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  // find account with reset token that has not expired
  const account = await Account.findOne(
    {
      resetToken: resetTokenHash,
      resetTokenExpiresIn: { $gt: Date.now() },
    },
    {
      resetTokenExpiresIn: 1,
      password: 1,
      resetToken: 1,
      passwordChangedAt: 1,
    }
  );
  // Don't allow password reset if token is invalid or has expired
  if (!account) {
    return next(
      new ApplicationError('Reset token is invalid or has expired', 401)
    );
  }
  // Don't allow reset if reset token has expired
  if (account.resetTokenExpiresIn.getTime() < Date.now()) {
    return next('Reset token has expired retry again', 401);
  }
  // Reset the password
  assignIgnore(
    {
      password: req.body.password,
      passwordChangedAt: Date.now(),
      resetToken: undefined,
      resetTokenExpiresIn: undefined,
    },
    account
  );
  // Resave changes to DB
  await account.save();
  res.json(account);
});

exports.getAccount = captureAsyncError(async (req, res, next) => {
  res.json(req.user);
});

exports.updateInformation = captureAsyncError(async (req, res, next) => {
  const account = req.user;
  const { firstname, lastname, email } = req.body;
  // update account info
  assign({ firstname, lastname, email }, account);
  // resave changes to DB
  await account.save();
  // respond to client with new updates
  res.json(account);
});

exports.getCart = captureAsyncError(async (req, res, next) => {
  console.log(req.user);
  res.json(req.user.cart);
});

exports.addToCart = captureAsyncError(async (req, res, next) => {
  const account = req.user;
  const { itemId } = req.body;

  !account.cart.find(id => id.equals(itemId)) &&
    account.cart.push(req.body.itemId);

  await account.save();
  res.json(account.cart);
});

exports.removeFromCart = captureAsyncError(async (req, res, next) => {
  const account = req.user;
  account.cart = account.cart.filter(id => !id.equals(req.body.itemId));
  await account.save();
  res.status(204).json();
});

exports.uploadProfileImage = captureAsyncError(async (req, res, next) => {});

exports.updateProfileImage = captureAsyncError(async (req, res, next) => {});

exports.getAccounts = captureAsyncError(async (req, res, next) => {
  const accounts = await Account.find().populate('cart').populate('purchases');

  res.json(accounts);
});
