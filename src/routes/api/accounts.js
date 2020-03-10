const { Router } = require('express');

const {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getAccount,
  updateInformation
} = require('../../controllers/routeHandlers/accounts');
const authenticate = require('../../controllers/authHandlers/authenticate');

const router = Router(); // merge params option

router.get('/my-account', authenticate, getAccount);

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/logout', authenticate, logout);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:resetToken', resetPassword);

router.post('/change-password', authenticate, changePassword);

router.patch('/update-my-account', authenticate, updateInformation);

module.exports = router;
