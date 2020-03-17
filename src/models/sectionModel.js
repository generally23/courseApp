const { Schema, model } = require('mongoose');

const sectionSchema = Schema({
  name: {
    type: String,
    required: [true, 'A section must have a name'],
    minlength: [10, 'A section must have name higher than 10 charcters']
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
