const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
            name: {
                        type: String,
                        required: [true, 'Please provide your name']
            },
            email: {
                        type: String,
                        required: [true, 'Please provide your email'],
                        unique: true
            },
            password: {
                        type: String,
                        required: [true, 'Please provide your password'],
                        maxlength: 8
            },
            passwordConfirm: {
                        type: String,
                        required: [true, 'Please confirm your password'],
                        maxlength: 8
            }
})

const User = mongoose.model("User", userSchema);
module.exports = User;