const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  getInventoryReport
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');
const { inventoryValidation } = require('../middleware/validation');

router.use(protect, authorize('Admin', 'Staff'));

router.get('/transactions', getTransactions);
router.post('/transactions', inventoryValidation.transaction, createTransaction);
router.get('/report', getInventoryReport);

module.exports = router;