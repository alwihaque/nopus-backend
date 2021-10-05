const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    _id: { //userEmail
        type: String,
        required: true
    },
    key: { //verification code
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Token', tokenSchema);
