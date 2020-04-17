const { Router } = require('express');
const lectureRouterApi = require('./lectures');
const {
  fetchCourseSection,
  createCourseSection,
  updateCourseSection,
  deleteCourseSection,
  fetchCourseSections,
} = require('../../controllers/routeHandlers/sections');

const router = Router({
  mergeParams: true,
});

router
  .route('/')
  //.get( fetchCourseSections )
  .post(createCourseSection);

router
  .route('/:sectionId')
  //.get( fetchCourseSection )
  .patch(updateCourseSection)
  .delete(deleteCourseSection);

router.use('/:sectionId/lectures', lectureRouterApi);

module.exports = router;
