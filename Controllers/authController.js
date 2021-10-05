const user = require('../Models/user');
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


};

module.exports.postSignUp = (req, res, next) => {
    //put your signUp Logic in this function
}
