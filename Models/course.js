const mongoose = require('mongoose');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    crn: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    creditHours: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    waitListTotal: {
        type: Number,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    meeting: {
        type: String,
        required: true
    },
    meetingInfo: {
        type: String,
        required: true
    }
});
courseSchema.plugin(mongoose_fuzzy_searching,{fields: ['title']});

module.exports = mongoose.model('Course', courseSchema);