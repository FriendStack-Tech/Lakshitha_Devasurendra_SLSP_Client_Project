const mongoose = require('mongoose');
const Counter = require('./Counter');

const paymentSchema = new mongoose.Schema({
  PaymentID: {
    type: String,
    unique: true,
    //required: true
  },
  OrderID: {
    type: String,
    ref: 'Order',
    required: true
  },
  PaymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash on Delivery', 'Digital Wallet'],
    required: true
  },
  Currency: {
    type: String,
    default: 'LKR',
    required: true
  },
  Amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  PaymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  PaymentDate: {
    type: Date,
    default: Date.now
  }
});

/**
 * Generate PaymentID safely
 * PAY00001
 */
paymentSchema.pre('save', async function (next) {
  if (!this.PaymentID) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'payment' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.PaymentID = `PAY${String(counter.seq).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);