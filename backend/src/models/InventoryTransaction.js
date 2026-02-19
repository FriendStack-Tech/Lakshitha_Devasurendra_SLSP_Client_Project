const mongoose = require('mongoose');
const Counter = require('./Counter');

const inventoryTransactionSchema = new mongoose.Schema({
  TransactionID: {
    type: String,
    unique: true,
    //required: true
  },
  ProductID: {
    type: String,
    ref: 'Product',
    required: true
  },
  TransactionType: {
    type: String,
    enum: ['Stock In', 'Stock Out', 'Adjustment', 'Sale', 'Return'],
    required: true
  },
  QuantityChanged: {
    type: Number,
    required: true
  },
  TransactionDate: {
    type: Date,
    default: Date.now
  },
  Remarks: {
    type: String,
    trim: true
  }
});

/**
 * Auto-generate TransactionID (TXN00001)
 */
inventoryTransactionSchema.pre('save', async function (next) {
  if (!this.TransactionID) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'transaction' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.TransactionID = `TXN${String(counter.seq).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema);