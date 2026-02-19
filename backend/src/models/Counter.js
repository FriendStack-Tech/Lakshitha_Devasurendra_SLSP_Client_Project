const mongoose = require('mongoose');

/**
 * Counter schema
 * Used to generate sequential IDs safely (atomic operation)
 */
const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Counter', counterSchema);