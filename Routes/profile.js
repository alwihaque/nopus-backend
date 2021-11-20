const express = require('express');
const router = express.Router();
const profileController = require('../Controllers/profileController');

/*
    Route to update preferences
 */
router.post('/profile/majorMinor/:uid', profileController.setMajorAndGrad);
router.post('/profile/courseList/:uid', profileController.setPrevCourses);
router.post("/profile/preferences/:uid", profileController.setPreferences);

module.exports = router;