const bcrypt = require('bcryptjs');
const send = require('../Util/mailer');
const User = require('../Models/user');
const {validationResult} = require('express-validator');

module.exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.length > 0) {
        return res.status(404).send(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({"email": email});

        if (!user) return res.status(404).send("Email or password you entered was incorrect.");

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(404).send("Email or password you entered was incorrect.");
        }
        if (!user.isVerified) {
            return res.status(404).send("User is not verified. Please verify your email to login.");
        }
        res.status(200).json({
            userId: user._id,
            email: user.email
        });
    } catch (e) {
        console.log(e.message);
    }

}

module.exports.postSignUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.length > 0) {
        return res.status(404).send(errors);
    }
    try {
        console.log(req.body.email);
        console.log(req.body.password);
        const email = req.body.email;
        const password = req.body.password;
        const hp = await bcrypt.hash(password, 10);
        const alreadyExists = await User.findOne({email});

        if (alreadyExists) {
            return res.status(404).send('User Already exists');
        }
        const user = await new User({
            email,
            password: hp,
            isVerified: false
        });
        await user.save();
        await send.sendEmail(email);
        res.status(200).json({
            user: user
        });
    } catch (e) {
        console.log(e.message);

    }
}
