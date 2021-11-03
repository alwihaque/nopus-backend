const express = require('express');
const router = express.Router();
const profileController = require('../Controllers/profileController');

/*
    Route to update preferences
 */

router.put("/profile/:uid", profileController.setPreferences);