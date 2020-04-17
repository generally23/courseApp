const { Router } = require('express');
const authenticate = require('../../controllers/authHandlers/authenticate');
const sectionRouter = require('./sections');
const reviewRouter = require('./reviews');
const {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  deleteAllCourses,
  deleteMyCourses,
  fetchCourse,
} = require('../../controllers/routeHandlers/courses');

const router = Router();

router
  .route('/')
  .get(fetchCourses)
  .post(authenticate, createCourse)
  .delete(authenticate, deleteAllCourses);

// router.post('/upload-poster')

router.delete('/delete-my-courses', authenticate, deleteMyCourses);

router
  .route('/:courseId')
  .get(fetchCourse)
  .patch(authenticate, updateCourse)
  .delete(authenticate, deleteCourse);

router.use('/:courseId/sections', sectionRouter);

router.use('/:courseId/reviews', reviewRouter);

module.exports = router;
