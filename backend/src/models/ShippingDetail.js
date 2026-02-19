const mongoose = require('mongoose');
const Counter = require('./Counter');

const shippingDetailSchema = new mongoose.Schema({
  ShippingID: {
    type: String,
    unique: true,
    //required: true
  },
  OrderID: {
    type: String,
    ref: 'Order',
    required: true
  },
  ShippingAddress: {
    type: String,
    required: [true, 'Shipping address is required']
  },
  Country: {
    type: String,
    required: [true, 'Country is required'],
    default: 'Sri Lanka'
  },
  CourierService: {
    type: String,
    enum: ['Sri Lanka Post', 'DHL', 'FedEx', 'UPS', 'Other'],
    default: 'Sri Lanka Post'
  },
  TrackingNumber: {
    type: String,
    trim: true
  },
  ShippingStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'In Transit', 'Delivered', 'Returned'],
    default: 'Pending'
  }
});

/**
 * Generate ShippingID safely
 * SHP00001
 */
shippingDetailSchema.pre('save', async function (next) {
  if (!this.ShippingID) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'shipping' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.ShippingID = `SHP${String(counter.seq).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('ShippingDetail', shippingDetailSchema);