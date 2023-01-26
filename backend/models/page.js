const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Page should have  title'],
    trim: true,
    maxLength: [256, 'Title should be less than 256'],
  },
  subtitle: {
    type: String,
    trim: true,
  },
  published: {
    type: Boolean,
    required: [true, 'Please enter published status'],
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  cover: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Page', pageSchema);
