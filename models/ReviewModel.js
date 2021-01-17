const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please Add A Title for a review"],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, "Please Add Some Text"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, "Please Add A Rating between 1 and 10"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

//Prevent user from submitting more than one review per bootcamp ******
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true})

module.exports = mongoose.model('Review', ReviewSchema);
