const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: String,
  postId: String,
  userId: String, // Optional
}, {
  timestamps: true,
});

module.exports = mongoose.model('Comment', CommentSchema);