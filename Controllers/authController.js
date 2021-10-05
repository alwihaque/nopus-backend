
const bcrypt = require('bcryptjs');
const mailer = require('nodemailer');
const User = require('../Models/user');

module.exports.postLogin = async (req, res, next) => {
    
    // Placeholder values for testing logic
    const email = "vsknvlksvnlskv"; // I'm assuming the actual value will be in req.email ?
    const password = "dvklnlkvkl";

    // Query user information given email
    const users = await User.findOne({"email":email});

    // Check if email exists
    if (!users) return res.status(200).send("Email or password you entered was incorrect.");
    // Check if password is correct
    else if (users.email != email) return res.status(200).send("Email or password you entered was incorrect.");
    // Check if user email is verified
    else if (!users.isVerified) return res.status(200).send("User is not verified. Please verify your email to login.");
    // If all good, send to home page
    else res.redirect('/home');

    // TODO: 1. Add hashing for passwords 2. Return proper "errors" 3. Email verification/authentication
    // Questions: Do I need to implement something to make sure the method is POST? 
}

module.exports.postSignUp = async (req, res, next) => {
    const exist = await User.exists({
        email: req.body.email
    });

    if(!exist) {
        if(req.body.password.length < 8 || !req.body.password.match("^[A-Za-z0-9]")) { 
            return res.send('Password must be at least 8 alphanumeric characters');
        }

        bcrypt.genSalt(10, function(err, salt) { 
            bcrypt.hash(req.body.password, salt, async function(err, hash) {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                await user.save();
            });
        });
    }
    else { //redirect user to login or just tell them the email exists?
        res.send('An account already exists with the email ' + req.body.email + '.');
    }

}
