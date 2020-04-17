const captureAsyncError = require('../../utils/captureAsyncErrors');
const Course = require('../../models/courseModel');
const ApplicationError = require('../../utils/AppError');
const { assign } = require('../../utils');

// exports.fetchLectures = captureAsyncError(async (req, res, next) => {
//   // find all lectures existing in the database
//   const lectures = await Lecture.find({
//     sectionId: req.params.sectionId,
//   });
//   // send back lelctures
//   res.json(lectures);
// });

exports.createLecture = captureAsyncError(async (req, res, next) => {
  // get lecture name, video sources, and transcripts
  const { name, sources, transcripts } = req.body;
  // find the course to create a lecture for
  const course = await Course.findById(req.params.courseId);
  // if no course was found, send an error
  if (!course) {
    return next(
      new ApplicationError(
        'Cannot create a lecture for a course that does not exist',
        404
      )
    );
  }

  // get the section you are creating a lecture for
  const section = course.sections.find(section =>
    section._id.equals(req.params.sectionId)
  );

  // if the section does not exist, send an error
  if (!section) {
    return next(
      new ApplicationError(
        'The section your are trying to create a lecture for was not found',
        404
      )
    );
  }

  // create a new lecture
  const lecture = new Lecture({
    name,
    sources,
    transcripts,
  });

  // insert the section lecture to the lectures field in the section
  section.lectures = [...section.lectures, lecture];
  // resave changes to the DB
  await course.save();
  // send created lecture
  res.status(201).json(lecture);
});

// exports.fetchLecture = captureAsyncError(async (req, res, next) => {
//   const lecture = await Lecture.findById(req.params.lectureId);
//   if (!lecture) {
//     return next(
//       new AppError('The lecture you were looking for was not found', 404)
//     );
//   }
//   res.json(lecture);
// });

exports.updateLecture = captureAsyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  // if ( !course ) return next( 'Course does not exist to update lecture for', 404 );

  if (!req.user._id.equals(course.authorId) || req.user.role !== 'admin') {
    return next(
      new ApplicationError('You cannot update a lecture you do not own', 403)
    );
  }

  const section = course.sections.find(section =>
    section._id.equals(req.params.sectionId)
  );

  if (!section) {
    return next(
      new ApplicationError(
        'The section to update a lecture for was not found',
        404
      )
    );
  }

  const lecture = section.lectures.find(lecture =>
    lecture._id.equals(req.params.lectureId)
  );

  assign({ name, sources, transcripts });

  await course.save();

  res.json(lecture);
});

exports.deleteLecture = captureAsyncError(async (req, res, next) => {
  const course = Course.findById(req.params.courseId);

  if (!course) {
    return next('Course does not exist to delete this lecture from', 404);
  }

  if (!req.user._id.equals(course.author_id) || req.user.role !== 'admin') {
    return next(
      new ApplicationError('You cannot delete a lecture you do not own', 403)
    );
  }

  const section = course.sections.find(section =>
    section._id.equals(req.params.sectionId)
  );

  if (!section) {
    return next(
      new ApplicationError(
        'The section to update a lecture for was not found',
        404
      )
    );
  }

  const lecture = section.lectures.find(lecture =>
    lecture._id.equals(req.params.lectureId)
  );

  if (!lecture) {
    return next(
      new AppError('The lecture you are trying to delete was not found', 404)
    );
  }

  section.lectures = section.lectures.filter(
    lecture => !lecture._id.equals(req.params.lectureId)
  );

  await course.save();

  res.status(204).json();
});

exports.deleteLectures = captureAsyncError(async (req, res, next) => {
  const course = Course.findById(req.params.courseId);

  return next(
    new AppError(
      'The lecture you are trying to delete has no parent course',
      404
    )
  );

  const section = course.sections.find(section =>
    section._id.equals(req.params.sectionId)
  );

  if (!section) {
    new AppError(
      'The lecture you are trying is in a section that does not exist',
      404
    );
  }

  section.lectures = [];

  await course.save();

  return next(
    new AppError('The lecture you are trying to delete was not found', 404)
  );

  res.status(204).json();
});
