const ApplicationError = require('../utils/AppError');
const captureAsyncError = require('../utils/captureAsyncErrors');
const Section = require('../../models/sectionModel');
const Course = require('../../models/courseModel');

exports.createCourseSection = captureAsyncError(async (req, res, next) => {
  const { courseId } = req.params;
  const { name, duration } = req.body;

  const newSection = Section.create({ name, duration, course_id: courseId });

  res.status(201).json(newSection);
});

exports.fetchCourseSections = captureAsyncError(async (req, res, next) => {
  const sections = await Section.find({ course_id: req.params.courseId });
  res.json(sections);
});

exports.fetchCourseSection = captureAsyncError(async (req, res, next) => {
  const { courseId, sectionId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(
      new ApplicationError(
        'Cannot find a section for an unexisting course',
        404
      )
    );
  }

  const section = await Section.findById(sectionId);
  if (!section) {
    return next(new ApplicationError('Cannot find section', 404));
  }

  res.json(section);
});

exports.updateCourseSection = captureAsyncError(async (req, res, next) => {
  const { courseId, sectionId } = req.params;
  const { name, duration } = req.body;
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ApplicationError('Cannot find course with this id', 404));
  }
  const section = await Section.findById(sectionId);
  if (!section) {
    return next(
      new ApplicationError(
        "A section cannot be updated if it doesn't exist",
        404
      )
    );
  }
  section.name = name ? name : section.name;
  section.duration = duration ? duration : section.duration;
  await section.save();
  res.json(section);
});

exports.deleteCourseSection = captureAsyncError(async (req, res, next) => {
  const { courseId, sectionId } = req.params;
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ApplicationError('A section cannot be deleted', 404));
  }

  const section = await Section.findById(sectionId);
  if (!section) {
    return next(
      new ApplicationError(
        "A section cannot be deleted if it doesn't exist",
        404
      )
    );
  }

  delete section.name;
  delete section.duration;

  section.save();

  res.json(section);
});