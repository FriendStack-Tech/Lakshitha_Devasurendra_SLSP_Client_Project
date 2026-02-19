const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
exports.userValidation = {
  register: [
    body().custom((value, { req }) => {
      const name = req.body.Name ?? req.body.name;
      const email = req.body.Email ?? req.body.email;
      const password = req.body.Password ?? req.body.password;
      if (!name) throw new Error('Name is required');
      if (!email) throw new Error('Email is required');
      if (!password) throw new Error('Password is required');
      return true;
    }),
    body('Name').optional().notEmpty().withMessage('Name is required').trim(),
    body('name').optional().notEmpty().withMessage('Name is required').trim(),
    body('Email').optional().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('email').optional().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('Password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('Role').optional().isIn(['Admin', 'Staff', 'Customer']).withMessage('Invalid role'),
    body('role').optional().isIn(['Admin', 'Staff', 'Customer']).withMessage('Invalid role'),
    validate
  ],
  login: [
    body().custom((value, { req }) => {
      const email = req.body.Email ?? req.body.email;
      const password = req.body.Password ?? req.body.password;
      if (!email) throw new Error('Email is required');
      if (!password) throw new Error('Password is required');
      return true;
    }),
    body('Email').optional().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('email').optional().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('Password').optional().notEmpty().withMessage('Password is required'),
    body('password').optional().notEmpty().withMessage('Password is required'),
    validate
  ]
};

// Product validation rules
exports.productValidation = {
  create: [
    body('ProductName').notEmpty().withMessage('Product name is required').trim(),
    body('Category').isIn(['Whole Spices', 'Ground Spices', 'Spice Blends', 'Herbs', 'Other'])
      .withMessage('Invalid category'),
    body('Price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('StockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
    validate
  ],
  update: [
    body('ProductName').optional().trim(),
    body('Category').optional().isIn(['Whole Spices', 'Ground Spices', 'Spice Blends', 'Herbs', 'Other'])
      .withMessage('Invalid category'),
    body('Price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('StockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
    validate
  ]
};

// Order validation rules
exports.orderValidation = {
  create: [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.ProductID').notEmpty().withMessage('Product ID is required'),
    body('items.*.Quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate
  ]
};

// Inventory validation rules
exports.inventoryValidation = {
  transaction: [
    body('TransactionType').isIn(['Stock In', 'Stock Out', 'Adjustment', 'Sale', 'Return'])
      .withMessage('Invalid transaction type'),
    body('QuantityChanged').isInt().withMessage('Quantity changed must be an integer'),
    validate
  ]
};