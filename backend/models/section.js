const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Field should have a key'],
    trim: true,
  },
  value: {
    type: String,
    required: [true, 'Field should have a value'],
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
  },
});

const BlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Block should have a type'],
    trim: true,
    enum: {
      values: [
        'payment',
        'messangers',
        'socials',
        'contact',
        'image',
        'image_slider',
        'video',
        'link',
        'map',
        'directions',
        'text',
        'faq',
        'counter',
        'rss',
        'sperator',
      ],
    },
  },
  fields: {
    type: [FieldSchema],
  },
  title: {
    type: String,
    required: [true, 'Block should have title'],
    trim: true,
  },
});

const SectionSchema = new mongoose.Schema({
  page: {
    type: mongoose.Schema.ObjectId,
    ref: 'Page',
    required: true,
  },
  blocks: {
    type: [BlockSchema],
    required: [true, 'Section should contain at least one block'],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Section', SectionSchema);
