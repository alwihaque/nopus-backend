
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
        const pass = req.body.password;
        if(req.body.password.length < 8 || !req.body.password.match("^[A-Za-z0-9]")) { 
            res.send('Password must be at least 8 alphanumeric characters');
            return;
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
        
        /*
        const token = new Token({
            _id: user.email,
            key: crypto.randomBytes(16).toString('hex')
        });
        token.save();

        var transporter = nodemailer.createTransport();
        var mailOptions = { from: 'no-reply@nopus.com', to: user.email, subject: 'Account Verification Link', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
        transporter.sendMail(mailOptions, function (err) {
            if (err) { 
                return res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
                }
            return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend.');
        });*/
    }
    else { //redirect user to login or just tell them the email exists?
        res.send('An account already exists with the email ' + req.body.email + '.');
    }

}
