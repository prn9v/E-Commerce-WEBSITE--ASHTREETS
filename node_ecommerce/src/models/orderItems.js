const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
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
    required: true
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
  },
  deliveryDate: {
    type: Date,
    default: Date.now
  }
});

const OrderItem = mongoose.model('orderItems', orderItemSchema);

module.exports = OrderItem;
