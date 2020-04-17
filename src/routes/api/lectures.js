const { Router } = require('express');

const router = Router({
  mergeParams: true,
});

const authenticate = require('../../controllers/authHandlers/authenticate');

const {
  createLecture,
  fetchLectures,
  fetchLecture,
  updateLecture,
  deleteLecture,
  deleteLectures,
} = require('../../controllers/routeHandlers/lectures');

router
  .route('/')
  //.get(fetchLectures)
  .post(authenticate, createLecture)
  .delete(authenticate, deleteLectures);

router
  .route('/:lectureId')
  //.get(fetchLecture)
  .patch(authenticate, updateLecture)
  .delete(authenticate, deleteLecture);

module.exports = router;
