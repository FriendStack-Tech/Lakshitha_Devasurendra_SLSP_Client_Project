const express = require('express');
const router = express.Router();
const {
  getPaymentByOrder,
  updatePaymentStatus,
  getAllPayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('Admin', 'Staff'), getAllPayments);
router.get('/order/:orderId', getPaymentByOrder);
router.put('/:id/status', authorize('Admin', 'Staff'), updatePaymentStatus);

module.exports = router;