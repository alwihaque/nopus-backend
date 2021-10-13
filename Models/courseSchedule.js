const mongoose = require('mongoose');

const courseScheduleSchema = new mongoose.Schema({
    credits: {
        type: Number,
        required: false,
        default: 0
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false,
        default: []
    }]
});

module.exports = mongoose.model('CourseSchedule', courseScheduleSchema);
