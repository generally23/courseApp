const { Schema, model } = require('mongoose');
const { hash, compare } = require('bcrypt');
const crypto = require('crypto');

const accountSchema = Schema({
  firstname: {
    type: String,
    required: [true, 'An account must have have a first name']
  },
  lastname: {
    type: String,
    required: [true, 'An account must have have a last name']
  },
  email: {
    type: String,
    required: [true, 'An account must have have an email']
  },
  password: {
    type: String,
    required: [true, 'An account must have have a password']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  passwordResetToken: {
    type: String
  },
  passwordChangedAt: {
    type: Date
  },
  resetTokenExpiresIn: {
    type: Date
  }
});

// middleware

accountSchema.pre('save', async function(next) {
  const account = this;
  if (!account.isModified('password')) return next();
  account.password = await hash(account.password, 12);
  next();
});

// instance methods

accountSchema.methods.verifyPassword = async function(password) {
  return await compare(password, this.password);
};

accountSchema.methods.generatePasswordResetToken = function() {
  // generate random bytes
  const resetToken = crypto.randomBytes(32).toString('hex');
  // hash bytes
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // store hashed reset token
  this.passwordResetToken = hashedToken;
  // update
  this.resetTokenExpiresIn = Date.now() + 3600000;
  // save changes to DB
  this.save();
  // return unhashed token
  return resetToken;
};

accountSchema.methods.accountChangedPasswordAfterTokenIssued = function(
  tokenIssueDate
) {
  if (!this.passwordChangedAt) return;
  return this.passwordChangedAt.getTime() < tokenIssueDate;
};

module.exports = model('Account', accountSchema);
