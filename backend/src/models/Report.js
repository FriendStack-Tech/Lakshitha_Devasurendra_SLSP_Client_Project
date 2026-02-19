const mongoose = require('mongoose');
const Counter = require('./Counter');

const reportSchema = new mongoose.Schema({
  ReportID: {
    type: String,
    unique: true,
    //required: true
  },
  ReportType: {
    type: String,
    enum: ['Sales Report', 'Inventory Report', 'Revenue Report', 'Customer Report'],
    required: true
  },
  GeneratedBy: {
    type: String,
    ref: 'User',
    required: true
  },
  GeneratedAt: {
    type: Date,
    default: Date.now
  },
  Data: {
    type: mongoose.Schema.Types.Mixed
  }
});

/**
 * Generate ReportID safely
 * RPT00001
 */
reportSchema.pre('save', async function (next) {
  if (!this.ReportID) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'report' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.ReportID = `RPT${String(counter.seq).padStart(5, '0')}`;
  }
  next();
});


module.exports = mongoose.model('Report', reportSchema);