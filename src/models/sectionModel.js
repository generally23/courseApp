const { Schema } = require('mongoose');
const lectureSchema = require('../models/lectureModel');

const sectionSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'A section must have a name'],
      minlength: [10, 'A section must have name higher than 10 charcters'],
    },
    duration: {
      type: Number,
      required: [true, 'A section must have a duration'],
    },
    lectures: [lectureSchema],
  },
  { timestamps: true }
);

sectionSchema.pre('remove', async function (next) {
  await Lecture.deleteMany({ sectionId: this.id });
  next();
});

module.exports = sectionSchema;
