// models/Jobs.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String, // Correct field name
        required: true,
    },
    experience: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    responsibilities: {
        type: String,
        required: true,
    },
    requiredDate: {
        type: Date,
        required: true,
    },
    ctc: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
