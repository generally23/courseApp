const { Router } = require('express');

const {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../../controllers/routeHandlers/courses');

const router = Router();

const sectionRouterApi = require('./sections');

router
  .route('/')
  .get(fetchCourses)
  .post(createCourse);

router
  .route('/:courseId')
  .get((req, res) => res.send('hello'))
  .patch(updateCourse)
  .delete(deleteCourse);

router.use('/:courseId/sections', sectionRouterApi);

module.exports = router;
