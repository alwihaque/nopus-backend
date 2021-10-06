
const bcrypt = require('bcryptjs');
const send = require('../Util/mailer');
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
    try {
        console.log(req.body.email);
        console.log(req.body.password);
        const email = req.body.email;
        const password = req.body.password;
        const hp = await bcrypt.hash(password, 10);
        const alreadyExists = User.find({email});
        if(alreadyExists){
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
    }
    catch (e) {
        console.log(e.message);

    }
}
