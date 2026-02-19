const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { UserID: user.UserID, Email: user.email || user.Email, Role: user.Role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const Name = req.body.Name ?? req.body.name;
    const rawEmail = req.body.email ?? req.body.Email;
    const Password = req.body.Password ?? req.body.password;
    const Role = req.body.Role ?? req.body.role;

    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : rawEmail;

    if (!Name || typeof Name !== 'string' || !Name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!Password || typeof Password !== 'string') {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { Email: email }]
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      Name: Name.trim(),
      email,
      Email: email,
      PasswordHash: Password,
      Role: Role || 'Customer'
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        UserID: user.UserID,
        Name: user.Name,
        Email: user.email || user.Email,
        Role: user.Role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const rawEmail = req.body.email ?? req.body.Email;
    const Password = req.body.Password ?? req.body.password;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : rawEmail;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!Password || typeof Password !== 'string') {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    // Check if user exists
    const user = await User.findOne({
      $or: [{ email }, { Email: email }]
    }).select('+PasswordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(Password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        UserID: user.UserID,
        Name: user.Name,
        Email: user.email || user.Email,
        Role: user.Role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ UserID: req.user.UserID });

    res.status(200).json({
      success: true,
      user: {
        UserID: user.UserID,
        Name: user.Name,
        Email: user.email || user.Email,
        Role: user.Role,
        CreatedAt: user.CreatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};