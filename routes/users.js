const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/Pinterest");

// Define the user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    dp: {
        type: String,
        default: 'default.jpg' // Default profile picture
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    }
});

userSchema.plugin(plm);

// Create the User model
module.exports = mongoose.model('User', userSchema);