const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please Add A Course title"]
    },
    description: {
        type: String,
        required: [true, "Please Add A Description"]
    },
    weeks: {
        type: String,
        required: [true, "Please Add A of weeks"]
    },
    tuition: {
        type: Number,
        required: [true, "Please Add A tuition const"]
    },
    minimumSkill: {
        type: String,
        required: [true, "Please Add A minimum skill"],
        enum: ['beginner', 'intermediate', 'advanced',]
    },
    scholarshipsAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'BootcampModel',
        required: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);
