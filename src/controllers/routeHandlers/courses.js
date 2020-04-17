const captureAsyncError = require('../../utils/captureAsyncErrors');
const Course = require('../../models/courseModel');
const ApplicationError = require('../../utils/AppError');
const { assign, paginate } = require('../../utils');

exports.fetchCourses = captureAsyncError(async (req, res, next) => {
  // get client query
  let { limit, page, sortBy = {}, search, price, length, category } = req.query;
  // sanitize query parameters
  // Note: limit & page are strings so Math.abs convert them to number and absolute them no need for parseInt
  if (limit) limit = Math.abs(limit);
  if (page) page = Math.abs(page);

  console.log(req.query);

  /*
    Allowed fields to be filtered by
    price
    length
    category
  */

  const filters = {};

  assign(
    { category, length: parseInt(length), price: parseInt(price) },
    filters
  );

  console.log(filters);

  const allCourses = await Course.find(filters, { sections: 0 })
    .sort({})
    .populate('author');

  const courses = paginate(allCourses, page, limit);

  res.json({
    ...courses,
  });
});

exports.fetchCourse = captureAsyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId)
    .populate('author')
    .populate('reviews');
  if (!course) {
    return next(
      new ApplicationError('The Course you were looking for was not found', 404)
    );
  }
  res.json(course);
});

exports.createCourse = captureAsyncError(async (req, res, next) => {
  // create course with body
  const newCourse = new Course(req.body);
  // associate course to the account that created this course
  newCourse.authorId = req.user.id;
  // save changes to db
  await newCourse.save();
  // send course as response
  res.status(201).json(newCourse);
});

exports.updateCourse = captureAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    requirements,
    prerequisites,
    objectives,
    price,
    discount,
    length,
  } = req.body;

  const course = await Course.findById(req.params.courseId);

  assign(
    {
      name,
      description,
      requirements,
      prerequisites,
      objectives,
      price,
      discount,
      length,
    },
    course
  );

  // resave to Db only if document was updated
  course.isModified() && (await course.save());
  // respond to client with the course object
  res.json(course);
});

exports.deleteCourse = captureAsyncError(async (req, res, next) => {
  // find course
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(
      new ApplicationError(
        'The course you are trying to delete was not found',
        404
      )
    );
  }
  if (!req.user._id.equals(course.authorId) || req.user.role !== 'admin') {
    return next(
      new ApplicationError(
        'You do not have permission to delete this course',
        403
      )
    );
  }

  await Course.deleteOne({ _id: req.params.courseId });

  res.status(204).json();
});

exports.updateCourses = captureAsyncError(async (req, res, next) => {});

exports.deleteAllCourses = captureAsyncError(async (req, res, next) => {
  await Course.deleteMany();
  res.status(204).json();
});

exports.deleteMyCourses = captureAsyncError(async (req, res, next) => {
  await Course.deleteMany({ authorId: req.user.id });
  res.status(204).json();
});

exports.uploadPoster = captureAsyncError(async (req, res, next) => {
  const file = req.file;
  res.send('hello');
});
