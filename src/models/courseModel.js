const { Schema, model } = require('mongoose');
const { deleteObjectProperties } = require('../utils');
const sectionSchema = require('../models/sectionModel');

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A course must have a name'],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'A course must have a description'],
    },
    poster: {
      type: String,
      default: 'https://source.unsplash.com/random',
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'A course must have an author'],
    },
    price: {
      type: Number,
      required: [true, 'A course must have a price'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    requirements: {
      type: String,
      required: [true, 'A course must have requirements'],
    },
    prerequisites: {
      type: String,
      required: [true, 'A course must have prerequisites'],
    },
    published: {
      type: Boolean,
      default: false,
    },
    length: {
      type: Number,
      required: [true, 'A course must have a length or duration'],
      minlength: [1, 'A course should at least be one hour long'],
      maxlength: [50, 'A course must be less than 50 hours long'],
    },
    objectives: {
      type: String,
      required: [true, 'A course must have objectives or goals'],
    },
    category: {
      type: String,
      required: [true, 'A course must have a category'],
      lowercase: true,
    },
    language: {
      type: String,
      default: 'English US',
      lowercase: true,
    },
    sections: [sectionSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// indexes

// virtuals

courseSchema.virtual('author', {
  ref: 'Account',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

courseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'reviewedCourseId',
});

// middlware

courseSchema.pre('remove', async function (next) {
  await Section.deleteMany({ courseId: this.id });
  next();
});

// instances

courseSchema.methods.toJSON = function () {
  const courseObject = this.toObject();
  deleteObjectProperties(courseObject, '__v', 'id');
  return courseObject;
};

const Course = model('Course', courseSchema);

module.exports = Course;
