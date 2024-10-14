const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart', // Reference to Cart model
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products', // Reference to Product model
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to User model
    required: true
  }
});

const CartItem = mongoose.model('cartItem', cartItemSchema);

module.exports = CartItem;
