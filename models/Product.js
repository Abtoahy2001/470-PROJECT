const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number'],
    set: val => Math.round(val * 100) / 100 // Ensures 2 decimal places
  },
  stock_quantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  category_id: {
    type: mongoose.Schema.Types.String,
    ref: 'Category', // Reference to a Category model if you have one
    required: [true, 'Category is required']
  },
  image_url: {
    type: String,
    default: '/placeholder.svg?height=400&width=400&text=Product+Image'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

productSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;