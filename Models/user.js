const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    major: [{type: String}],
    minor: [{type: String}],
    graduationTerm: {
        semester: {
            type: String,
            enum: ['Fall', 'Spring'],
            default: 'Spring'
        },
        year: {
            type: Number,
            default: new Date(Date.now()).getFullYear()
        },
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