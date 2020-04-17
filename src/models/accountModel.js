const { Schema, model } = require('mongoose');
const { hash, compare } = require('bcrypt');
const crypto = require('crypto');
const { deleteObjectProperties } = require('../utils');

const accountSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'An account must have have a first name'],
      minlength: [2, 'A first name must be greater than 3 character'],
    },
    lastname: {
      type: String,
      required: [true, 'An account must have have a last name'],
      minlength: [2, 'A last name must be greater than 3 character'],
    },
    email: {
      type: String,
      required: [true, 'An account must have have an email'],
    },
    purchases: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Purchase',
      },
    ],
    password: {
      type: String,
      required: [true, 'An account must have have a password'],
      minlength: [8, 'A seucure password must be at least 8 characters'],
      select: false,
    },
    profileImage: {
      type: String,
      default: 'https://source.unsplash.com/random',
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    resetToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    resetTokenExpiresIn: {
      type: Date,
      select: false,
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
  { timestamps: true }
);

// virtuals

// middleware

accountSchema.pre('save', async function (next) {
  const account = this;
  if (!account.isModified('password')) return next();
  account.password = await hash(account.password, 12);
  next();
});

// instance methods

accountSchema.methods.verifyPassword = async function (password = '') {
  return await compare(password, this.password);
};

accountSchema.methods.generatePasswordResetToken = async function () {
  // generate random bytes
  const resetToken = crypto.randomBytes(32).toString('hex');
  // hash bytes
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // store hashed reset token
  this.resetToken = hashedToken;
  // update
  this.resetTokenExpiresIn = Date.now() + 3600000;
  // save changes to DB
  await this.save();
  // return unhashed token
  return resetToken;
};

accountSchema.methods.accountChangedPasswordAfterTokenIssued = function (
  tokenIssueDate
) {
  if (!this.passwordChangedAt) return;
  return this.passwordChangedAt.getTime() < tokenIssueDate;
};

accountSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  deleteObjectProperties(userObject, 'password', '__v');
  return userObject;
};

module.exports = model('Account', accountSchema);
