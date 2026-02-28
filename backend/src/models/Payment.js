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
    enum: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash on Delivery', 'PayHere'],
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
  },
  PayherePaymentID: { 
    type: String 
  },
  StatusCode: { 
    type: Number 
  },    // 2=success, 0=pending, -1=cancelled, -2=failed
  Method: { 
    type: String 
  },     // VISA, MASTER, etc.
  StatusMessage: { 
    type: String 
  },
}, { timestamps: true });

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