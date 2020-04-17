const captureAsyncError = require('../../utils/captureAsyncErrors');
const Review = require('../../models/reviewModel');
const ApplicationError = require('../../utils/AppError');
const { assign } = require('../../utils');

const createReview = captureAsyncError(async (req, res, next) => {
  const review = await Review.create({
    ...req.body,
    reviewerId: req.user.id,
    reviewedCourseId: req.params.courseId,
  });
  res.status(201).json(review);
});

const getCourseReviews = captureAsyncError(async (req, res, next) => {
  const reviews = await Review.find({ reviewedCourseId: req.params.courseId });
  res.json(reviews);
});

const updateMyReview = captureAsyncError(async (req, res, next) => {
  const { title, text, rating } = req.body;
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(
      new ApplicationError(
        'The review you are trying to update does not exist',
        404
      )
    );
  }
  if (!review.reviewerId.equals(req.user.id)) {
    return next(
      new ApplicationError(
        'You are not allowed to update a review that is not yours',
        403
      )
    );
  }
  // perform changes by assigning properties to the review object
  assign({ title, text, rating }, review);
  // resave to Db only if document was updated
  review.isModified() && (await review.save());
  res.json(review);
});

const deleteMyReview = captureAsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return next(
      new ApplicationError(
        'The review you are trying to delete does not exist',
        404
      )
    );
  }

  if (review.reviewerId.equals(req.user.id)) {
    return next(
      new ApplicationError('You do not own this review to delete it', 403)
    );
  }

  res.status(204).json();
});

module.exports = {
  createReview,
  getCourseReviews,
  updateMyReview,
  deleteMyReview,
};
