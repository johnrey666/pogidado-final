// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    videoUrl: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Post', PostSchema);