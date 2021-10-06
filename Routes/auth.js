const express = require('express');
const authController = require('../Controllers/authController');
const router = express.Router();
const {check} = require('express-validator');

router.post('/login',[check('email').isEmail(), check('password').isLength({min: 5}).isAlphanumeric()],authController.postLogin);
router.post('/signUp', [check('email').isEmail(), check('password').isLength({min: 5}).isAlphanumeric()], authController.postSignUp);

module.exports = router;
