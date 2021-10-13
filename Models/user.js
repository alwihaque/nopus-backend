const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    coursesTaken: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false,
        default: []
    }],
    courseSchedules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseSchedule',
        default: []
    }]

});

module.exports = mongoose.model('User', userSchema);