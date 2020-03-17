const multer = require('multer');
const { resolve } = require('path')

const upload = ({ name = 'diskStorage', options = { destination: resolve(__dirname, '..', '..', 'uploads') } } = {}, uploaderOptions = {}) => {
  const storage = multer[name]({ ...options });
  const uploader = multer({ storage, ...uploaderOptions })
  return uploader;
}

module.exports = upload;
