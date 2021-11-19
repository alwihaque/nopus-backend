const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    to: [{
        name: {
            type: String,
            required: true,
        },
        destination: {
            type: mongoose.Types.ObjectId,
            ref: 'Building',
            required: true
        },
        time: {
            type: Number,
            required: true
    }
    }]
});

module.exports = mongoose.model('Building', buildingSchema);
