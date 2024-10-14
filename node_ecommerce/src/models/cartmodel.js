const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to User model
    required: true
  },
  cartItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cartItem', // Reference to User model
    required: true
  }],
  totalPrice: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0
  },
  totalDiscountedPrice: {
    type: Number,
    required: true,
    default: 0
  },
  discounts: [{
    type: Number,
    required: true,
    default: 0
  }]
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
