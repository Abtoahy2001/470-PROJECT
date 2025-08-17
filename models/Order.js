const mongoose = require('mongoose');
const orderItemSchema = require('./OrderItem');


const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: 0
  },
  shipping_fee: {
    type: Number,
    required: [true, 'Shipping fee is required'],
    min: 0,
    default: 0
  },
  tax: {
    type: Number,
    required: [true, 'Tax amount is required'],
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: 0
  },
  shipping_address: {
    type: String,
    required: [true, 'Shipping address is required'],
    trim: true
  },
  payment_method: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    default: 'credit_card'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  order_status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  tracking_number: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;