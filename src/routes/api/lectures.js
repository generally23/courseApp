const { Router } = require('express');

const router = Router();

router
  .route('/')
  .get()
  .post();

router
  .route('/:lectureId')
  .get()
  .patch()
  .delete();

module.exports = router;
