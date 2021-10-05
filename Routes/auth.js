const express = require('express');
const authController = require('../Controllers/authController');
const router = express.Router();

router.post('/login',authController.postLogin);
router.post('/signUp', express.urlencoded({extended: true}), authController.postSignUp);

module.exports = router;
