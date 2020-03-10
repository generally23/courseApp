const { Schema, model } = require('mongoose');

const sectionSchema = Schema({
  name: {
    type: String,
    required: [true, 'A section must have an name']
  },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'A section must have an author']
  },
  creation_date: {
    type: Date,
    default: Date.now()
  },
  update_date: {
    type: Date,
    default: Date.now()
  },
  duration: {
    type: Number,
    required: [true, 'A section must have a duration']
  }
});

module.exports = model('Section', sectionSchema);
