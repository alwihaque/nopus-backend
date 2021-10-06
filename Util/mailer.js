
const sgMail = require('@sendgrid/mail');
module.exports.sendEmail = async (email) => {
    console.log()
    sgMail.setApiKey('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');
    const msg = {
        to: email, // Change to your recipient
        from: 'alwi.m.haque@gmail.com', // Change to your verified sender
        subject: 'Welcome to Nopus',
        text: 'Hello you are on of our first users',
        html: '<strong>and we will sort out all scheduling worries</strong>',
    }
    try {
        await sgMail.send(msg);
    }
    catch (e) {
        console.log(e.message);
    }

}


