const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products', // Reference to Product model
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to User model
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review;
