const { Router } = require('express');
const router = Router(); // merge params option
const authenticate = require('../../controllers/authHandlers/authenticate');
const { resolve } = require('path')
const {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getAccount,
  updateInformation,
  uploadProfileImage,
  updateProfileImage
} = require('../../controllers/routeHandlers/accounts');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: resolve(__dirname, '..', '..', 'uploads'),
  filename(req, file, cb) {
    const fileParts = file.originalname.split('.');
    const ext = fileParts[fileParts.length - 1];
    cb(null, `${fileParts[0]}-${req.user.id}.${ext}`);
  }
});

const upload = multer({ storage });

router.get('/my-account', authenticate, getAccount);

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/logout', authenticate, logout);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:resetToken', resetPassword);

router.post('/change-password', authenticate, changePassword);

router.patch('/update-my-account', authenticate, updateInformation);

router.post('/upload-profile', authenticate, upload.single('profile'), uploadProfileImage);

router.patch('/update-profile', authenticate, upload.single('profile'), updateProfileImage)

module.exports = router;
