const mongoose = require('mongoose');
const validator = require('validator')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail,"Please enter a valid email address" ]
    },
    password: {
        type: String,
        required: false
    },
    roles: {
        type: [String],
        default: ["Customer"]
    },


});

module.exports = mongoose.model('User', userSchema);  