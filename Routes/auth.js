const express = require('express');
const authController = require('../Controllers/authController');
const router = express.Router();
const {body} = require('express-validator');

router.post('/login',[body('email').isEmail(), body('password').isLength({min: 5}).isAlphanumeric()],authController.postLogin);
router.post('/signUp', [body('email').isEmail(), body('password').isLength({min: 5}).isAlphanumeric()], authController.postSignUp);

module.exports = router;
