const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },

    resetPasswordToken: String,
    resetPasswordExpires: Date

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
