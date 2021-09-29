const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    numSections: {
        type: Number,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true,
    },
    gerDesignation: {
        type: String,
        required: true
    },
    sections: [{
        sectionNumber: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        //think about storing
        meetingTimes: {
            type: String,
            required: true
        },
        sectionNotes: {
            type: String,
            required: true
        },
        sectionDescription: {
            type: String,
            required: true
        }
    }]

});

module.exports = mongoose.model('Course', courseSchema);