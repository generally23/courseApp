const { Schema, model } = require('mongoose');

const reviewSchema = Schema({
  review_title: {},
  reviewer_id: {},
  review_text: {},
  review_score: {},
  creation_date: {},
  update_date: {}
});

exports.Review = model('Review', reviewSchema);
