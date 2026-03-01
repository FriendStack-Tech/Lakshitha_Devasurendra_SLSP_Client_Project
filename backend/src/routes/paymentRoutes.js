const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  paymentNotify,
  getPaymentStatus,
  getPaymentByOrder,
  updatePaymentStatus,
  getAllPayments,
  verifyAndComplete
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.post('/initiate', protect, initiatePayment);
router.post('/notify', paymentNotify);
router.post('/verify', protect, verifyAndComplete);
router.get('/status/:orderId', protect, getPaymentStatus);
router.get('/order/:orderId', protect, getPaymentByOrder);
router.get('/', protect, authorize('Admin', 'Staff'), getAllPayments);
router.put('/:id/status', protect, updatePaymentStatus);

module.exports = router;