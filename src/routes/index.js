const { Router } = require('express');
const Course = require('../models/courseModel');
const captureAsyncError = require('../utils/captureAsyncErrors');
const router = Router();
const { paginate } = require('../utils');

exports.API_ROOT_PATH = '/api/v1';

router.get(
  '/',
  captureAsyncError(async (req, res) => {
    const allCourses = await Course.find();
    let { page, limit } = req.query;
    if (page) page = Math.abs(page);
    if (limit) limit = Math.abs(limit);

    console.log(page);

    const courses = paginate(allCourses, page, 4);

    res.render('index', { courses });
  })
);

router.get('/courses/:courseName');

router.get('/my-account');

module.exports = router;
