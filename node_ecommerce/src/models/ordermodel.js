const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to User model
    required: true
  },
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orderItems', // Reference to CartItem model
    required: true
  }],
  orderDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  deliveryDate: {
    type: Date
  },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'addresses', // Reference to Address model
    required: true
  },
  paymentDetails: {
    paymentMethod: {
        type: String,
        
      },
      transactionId: {
        type: String,
       
      },
      paymentId: {
        type: String,
       
      },
      paymentStatus: {
        type: String,
       
      }
  },
  totalPrice: {
    type: Number,
    required: true
  },
  totalDiscountedPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  orderStatus: {
    type: String,
    default: 'Pending',
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
