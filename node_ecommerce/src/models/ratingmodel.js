const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to User model
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products', // Reference to Product model
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // Assuming a rating scale of 1 to 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Rating = mongoose.model('ratings', ratingSchema);

module.exports = Rating;
