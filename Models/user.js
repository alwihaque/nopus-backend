const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // email: {
    //     type: String,
    //     required: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    // isVerified: {
    //     type: Boolean,
    //     required: true,
    //     default: false
    // },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    graduationTerm: {
        type: Number,
        // required: true
    },
    minCredit: {
        type: Number,
        // required: true
    },
    maxCredit: {
        type: Number,
        // required: true
    },
    availabilities: {
      type: Object,
        // required: true
    },
    coursesTaken: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: []
    }],
    courseSchedules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseSchedule',
        default: []
    }]

});

module.exports = mongoose.model('User', userSchema);