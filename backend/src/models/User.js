const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/env');

const userSchema = new mongoose.Schema({
  UserID: {
    type: String,
    unique: true,
  },
  Name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  // Canonical field (matches existing MongoDB index name `email_1`)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  // Backward-compatible legacy field (older docs may have `Email` instead of `email`)
  Email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  PasswordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  Role: {
    type: String,
    enum: ['Admin', 'Staff', 'Customer'],
    default: 'Customer'
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ONLY ONE pre-save hook - does BOTH UserID and password
userSchema.pre('save', async function(next) {
  try {
    // Generate UserID using timestamp (unique!)
    if (!this.UserID) {
      this.UserID = `USR${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }

    // Keep legacy `Email` and canonical `email` in sync
    if (this.isModified('Email') && !this.email) {
      this.email = this.Email;
    }
    if (this.isModified('email') && !this.Email) {
      this.Email = this.email;
    }
    
    // Hash password
    if (this.isModified('PasswordHash')) {
      const salt = await bcrypt.genSalt(10);
      this.PasswordHash = await bcrypt.hash(this.PasswordHash, salt);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.PasswordHash);
};

module.exports = mongoose.model('User', userSchema);