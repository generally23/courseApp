const router = require('express').Router({ mergeParams: true });
const authenticate = require('../../controllers/authHandlers/authenticate');
const {
  createReview,
  getCourseReviews,
  updateMyReview,
  deleteMyReview,
} = require('../../controllers/routeHandlers/reviews');

router
  .route('/')
  // fetch all reviews for a course
  .get(getCourseReviews)
  // create a new review on a course
  .post(authenticate, createReview);

router
  .route('/:reviewId')
  .patch(authenticate, updateMyReview)
  .delete(authenticate, deleteMyReview);

module.exports = router;
