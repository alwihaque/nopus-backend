const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/coursesController');

router.get('/home', courseController.getCourses);
router.get('/home/:prefix', courseController.getSpecifiedCourses);
module.exports = router;