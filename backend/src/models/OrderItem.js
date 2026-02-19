const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderItemSchema = new mongoose.Schema({
  OrderItemID: {
    type: String,
    unique: true,
    //required: true
  },
  OrderID: {
    type: String,
    ref: 'Order',
    required: true
  },
  ProductID: {
    type: String,
    ref: 'Product',
    required: true
  },
  Quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  UnitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative']
  }
});

/**
 * Generate OrderItemID safely
 * OIT00001
 */
orderItemSchema.pre('save', async function (next) {
  if (!this.OrderItemID) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'order_item' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.OrderItemID = `OIT${String(counter.seq).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('OrderItem', orderItemSchema);