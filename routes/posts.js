const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the post schema
const postSchema = new Schema({
    imageText: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: []
    },
    // Reference to the user who created the post
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Create the Post model
module.exports = mongoose.model('Post', postSchema);