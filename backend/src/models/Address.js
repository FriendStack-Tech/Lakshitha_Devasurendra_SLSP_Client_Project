const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  FullName: {
    type: String,
    required: true,
    trim: true
  },

  PhoneNumber: {
    type: String,
    required: true,
    trim: true
  },

  AddressLine1: {
    type: String,
    required: true,
    trim: true
  },

  AddressLine2: {
    type: String,
    trim: true
  },

  City: {
    type: String,
    required: true,
    trim: true
  },

  District: {
    type: String,
    required: true,
    trim: true
  },

  Province: {
    type: String,
    required: true,
    trim: true
  },

  PostalCode: {
    type: String,
    required: true,
    trim: true
  },

  Country: {
    type: String,
    default: 'Sri Lanka'
  },

  IsDefault: {
    type: Boolean,
    default: false
  },

  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Address', addressSchema);