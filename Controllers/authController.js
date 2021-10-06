
const bcrypt = require('bcryptjs');
const mailer = require('nodemailer');
const User = require('../Models/user');

module.exports.postLogin = async (req, res, next) => {
    
    // Placeholder values for testing logic
    const email = req.body.email; // I'm assuming the actual value will be in req.email ?
    const password = req.body.password;
    // Query user information given email
    try {
        const user = await User.findOne({"email":email});
        // Check if email exists
        if (!user) return res.status(404).send("Email or password you entered was incorrect.");
        // Check if password is correct
        const match = await bcrypt.compare(password,user.password);
        if(!match) {
            return res.status(404).send("Email or password you entered was incorrect.");
        }
        // Check if user email is verified
        if (!user.isVerified) {
            return res.status(404).send("User is not verified. Please verify your email to login.");
        }
        res.status(200).json({
            userId: user._id,
            email: user.email
        });
    }
    catch (e) {
        console.log(e.message);
    }

    // If all good, send to home page


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
