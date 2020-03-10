const captureAsyncError = require('../utils/captureAsyncErrors');

const Course = require('../../models/courseModel');

exports.fetchCourses = captureAsyncError(async (req, res, next) => {
  const courses = await Course.find();
  console.log(courses);
  res.json(courses);
});

exports.createCourse = captureAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    requirements,
    prerequisites,
    discount,
    objectives,
    length,
    price
  } = req.body;

  const newCourse = await Course.create({
    name,
    description,
    requirements,
    prerequisites,
    discount,
    objectives,
    length,
    price
  });

  res.status(201).json(newCourse);
});

exports.updateCourse = captureAsyncError(async (req, res, next) => {
  const course = Course.findById(req.params.courseId);
});

exports.deleteCourse = captureAsyncError(async (req, res, next) => {
  const deletedCourse = await Course.findByIdAndDelete(req.params.courseId);
  console.log(deletedCourse);
  res.status(204).json({});
});
