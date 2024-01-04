const mongoose = require('mongoose');
const {Schema} = mongoose

// Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    last_name: {
        type: String,
    },
    first_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar_url: {
        type: String,
        required: [true, "Avatar_url is required"],
    },
    type: {
        type: String,
        required: [true, "Type is required"],
    },
})

// Model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel  