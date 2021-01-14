const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// Encrypt password using bcryptjs **********************
UserSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and Return *********************************
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id: this._id, name: this.name}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

//Match user entered password to hashed password ***************
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generate and Hash Password Token ******************************************
UserSchema.methods.getResetPasswordToken = function () {
// Generate Token **********************************************************
    const resetToken = crypto.randomBytes(20).toString('hex');

// Has token and resetPasswordToken field **********************************
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

// Set Expire Time ********************************************************
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
