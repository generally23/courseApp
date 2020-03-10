const { Router } = require('express');

const {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getAccount,
  updateInformation,
  uploadProfileImage
} = require('../../controllers/routeHandlers/accounts');
const authenticate = require('../../controllers/authHandlers/authenticate');

const router = Router(); // merge params option

const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads',
  filename(req, f, cb) {
    cb(null, f.originalname + '-file');
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

router.post('/upload-profile', upload.single('fichier'), uploadProfileImage);

module.exports = router;
