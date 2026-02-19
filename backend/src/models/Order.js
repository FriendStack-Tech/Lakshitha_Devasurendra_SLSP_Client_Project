const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderSchema = new mongoose.Schema({
  OrderID: {
    type: String,
    unique: true,
    //required: true
  },
  UserID: {
    type: String,
    ref: 'User',
    required: true
  },
  OrderNumber: {
    type: String,
    unique: true,
    //required: true
  },
  OrderDate: {
    type: Date,
    default: Date.now
  },
  OrderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  TotalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Generate OrderID and OrderNumber safely
 * ORD00001
 * INV-00001
 */
orderSchema.pre('save', async function (next) {
  if (!this.OrderID) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'order' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.OrderID = `ORD${String(counter.seq).padStart(5, '0')}`;
    this.OrderNumber = `INV-${String(counter.seq).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);