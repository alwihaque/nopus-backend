const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/coursesController');

router.get('/home', courseController.getCourses);
router.get('/home/id/:id', courseController.getCourseById);
router.get('/home/:prefix', courseController.getSpecifiedCourses);
router.post('/home/schedule', courseController.generateSchedule);
module.exports = router;