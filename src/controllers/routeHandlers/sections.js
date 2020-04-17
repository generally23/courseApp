const ApplicationError = require('../../utils/AppError');
const captureAsyncError = require('../../utils/captureAsyncErrors');
const Section = require('../../models/sectionModel');
const Course = require('../../models/courseModel');
const { assign } = require('../../utils');

exports.createCourseSection = captureAsyncError(async (req, res, next) => {
  const { courseId } = req.params;
  const { name, duration } = req.body;
  // try to find the course to create a section for
  const course = await Course.findById(courseId);
  // send an error if no course was found
  if (!course) {
    return next(
      new ApplicationError(
        'The course you are trying to create a section for does not exist',
        404
      )
    );
  }
  // embed the section to inside the course document
  course.sections = [...course.sections, req.body];
  // resave changes to the Db
  await course.save();
  // respond to the client with the new created section
  res.status(201).json();
});

// exports.fetchCourseSections = captureAsyncError(async (req, res, next) => {
//   const sections = await Section.find({
//     courseId: req.params.courseId,
//   });
//   res.json(sections);
// });

// exports.fetchCourseSection = captureAsyncError(async (req, res, next) => {
//   const { courseId, sectionId } = req.params;

//   const course = await Course.findById(courseId);

//   if (!course) {
//     return next(
//       new ApplicationError(
//         'Cannot find a section for an unexisting course',
//         404
//       )
//     );
//   }

//   const section = await Section.findById(sectionId);

//   if (!section) {
//     return next(new ApplicationError('Cannot find section', 404));
//   }

//   res.json(section);
// });

exports.updateCourseSection = captureAsyncError(async (req, res, next) => {
  const { courseId, sectionId } = req.params;
  const { name, duration } = req.body;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(
      new ApplicationError('Cannot find course to update a section for', 404)
    );
  }

  const { sections } = course;

  const targetSection = sections.find(section => section._id.equals(sectionId));

  if (!targetSection) {
    return next(
      new ApplicationError(
        'The section you are trying to update was not found',
        404
      )
    );
  }
  // make the updates
  assign({ name, duration }, targetSection);
  // resave changes to the DB
  await course.save();
  // respond to the client with the updated section
  res.json(targetSection);
});

exports.deleteCourseSection = captureAsyncError(async (req, res, next) => {
  const { courseId, sectionId } = req.params;
  const course = await Course.findById(courseId);

  if (!course) {
    return next(
      new ApplicationError(
        'This course to delte a section for does not exist',
        404
      )
    );
  }

  const { sections } = course;

  const targetSection = sections.find(section => section._id.equals(sectionId));

  if (!targetSection) {
    return next(
      new ApplicationError(
        'The section you are trying to delete was not found',
        404
      )
    );
  }
  // delete the section
  course.sections = sections.filter(section => !section._id.equals(sectionId));
  // resave changes to DB
  await course.save();
  // respond back to client
  res.status(204).json();
});
