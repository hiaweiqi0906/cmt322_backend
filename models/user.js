const mongoose = require('mongoose');
const {Schema} = mongoose

// Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar_url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
})

// Model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel  