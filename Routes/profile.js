const express = require('express');
const router = express.Router();
const profileController = require('../Controllers/profileController');

/*
    Route to update preferences
 */
router.put('/profile/majorMinor/:uid', profileController.setMajorAndGrad);
router.put('/profile/courseList/:uid', profileController.setPrevCourses);
router.put("/profile/preferences/:uid", profileController.setPreferences);

module.exports = router;