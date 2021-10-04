const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/coursesController');

router.get('/home', courseController.getCourses);

module.exports = router;