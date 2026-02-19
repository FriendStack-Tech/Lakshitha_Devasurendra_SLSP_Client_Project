const mongoose = require('mongoose');
const Counter = require('./Counter');

const productSchema = new mongoose.Schema({
  ProductID: {
    type: String,
    unique: true,
    //required: true
  },
  ProductName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  Category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Whole Spices', 'Ground Spices', 'Spice Blends', 'Herbs', 'Other']
  },
  Description: {
    type: String,
    trim: true
  },
  Price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  StockQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  ImageURL: {
    type: String,
    default: 'default-product.jpg'
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  },
  UpdatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Auto-generate ProductID (PRD00001)
 * Uses atomic counter to avoid duplicates
 */
productSchema.pre('save', async function (next) {
  if (!this.ProductID) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'product' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.ProductID = `PRD${String(counter.seq).padStart(5, '0')}`;
  }

  this.UpdatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);