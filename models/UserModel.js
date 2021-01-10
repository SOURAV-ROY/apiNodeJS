const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Add A Name Please"]
    },
    email: {
        type: String,
        required: [true, "Please Add A An email"],
        unique: true,
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            "Please add a valid email"
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, "Please Add A Password"],
        minlength: 6,
        select: false
    },
    resetPasswordToken: {
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }
});

module.exports = mongoose.model('User', UserSchema);