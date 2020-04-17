const { Schema, model } = require('mongoose');

const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A review must have a title'],
      minlength: [
        5,
        'A review must have a title greater than or equal to 5 characters',
      ],
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'A review must have a reviewer'],
    },
    reviewedCourseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'A review must be attributed to a course'],
    },
    text: {
      type: String,
      required: [true, 'A review must have content'],
      minlength: [10, 'A review content must be greater than 10 characters'],
    },
    rating: {
      type: Number,
      minlength: [1, 'A rating must be between 1 and 5'],
      maxlength: [5, 'A rating must be between 1 and 5'],
      required: [true, 'A review must have a rating'],
    },
  },
  { timestamps: true }
);

module.exports = model('Review', reviewSchema);
