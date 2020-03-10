const { Router } = require('express');
const Course = require('../../models/courseModel');

const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.render('courses', { courses });
});

router.get('/courses/:courseName');

module.exports = router;
