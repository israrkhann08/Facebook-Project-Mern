const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: false
    },
    otpVerified: {
        type: Boolean,
        default: false,
    },
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);