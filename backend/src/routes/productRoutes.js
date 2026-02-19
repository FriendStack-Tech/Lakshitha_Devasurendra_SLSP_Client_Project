const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { productValidation } = require('../middleware/validation');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes
router.get('/low-stock/:threshold?', protect, authorize('Admin', 'Staff'), getLowStockProducts);
router.post('/', protect, authorize('Admin'), productValidation.create, createProduct);
router.put('/:id', protect, authorize('Admin'), productValidation.update, updateProduct);
router.delete('/:id', protect, authorize('Admin'), deleteProduct);

module.exports = router;