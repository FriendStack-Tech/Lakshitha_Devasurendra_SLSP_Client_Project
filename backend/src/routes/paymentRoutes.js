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

// routes/paymentRoutes.js — TEMPORARY DEBUG, remove after fixing
router.get('/debug-credentials', (req, res) => {
  const crypto = require('crypto');
  
  const rawMerchantId     = process.env.PAYHERE_MERCHANT_ID;
  const rawMerchantSecret = process.env.PAYHERE_SECRET;
  
  const merchantId     = (rawMerchantId || '').trim();
  const merchantSecret = (rawMerchantSecret || '').trim();

  const testOrderId    = 'TEST123';
  const testAmount     = '1200.00';
  const testCurrency   = 'LKR';

  const hashedSecret = crypto.createHash('md5').update(merchantSecret, 'utf8').digest('hex').toUpperCase();
  const hashInput    = merchantId + testOrderId + testAmount + testCurrency + hashedSecret;
  const finalHash    = crypto.createHash('md5').update(hashInput, 'utf8').digest('hex').toUpperCase();

  res.json({
    // Raw values — spot any quotes, spaces, newlines
    raw: {
      PAYHERE_MERCHANT_ID: JSON.stringify(rawMerchantId),
      PAYHERE_SECRET:      JSON.stringify(rawMerchantSecret),
    },
    // Trimmed values
    trimmed: {
      merchantId,
      merchantIdLength:     merchantId.length,
      merchantSecretLength: merchantSecret.length,
      isNumeric:            /^\d+$/.test(merchantId),
    },
    // Hash chain — verify each step
    hashChain: {
      step1_hashedSecret: hashedSecret,
      step2_hashInput:    hashInput,
      step3_finalHash:    finalHash,
    }
  });
});

module.exports = router;