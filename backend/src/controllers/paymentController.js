const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Address = require('../models/Address');
const User = require('../models/User');
const crypto = require('crypto');
const config = require('../config/env');

// ─── Helper functions ────────────────────────────────────
function md5(input) {
  return crypto.createHash('md5').update(input, 'utf8').digest('hex');
}

function generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret) {
  const formattedAmount = parseFloat(amount).toFixed(2);
  const hashedSecret    = md5(merchantSecret).toUpperCase();
  const hashInput       = merchantId + orderId + formattedAmount + currency + hashedSecret;

  console.log('=== Hash Debug ===');
  console.log('merchantId    :', JSON.stringify(merchantId));
  console.log('orderId       :', JSON.stringify(orderId));
  console.log('amount        :', JSON.stringify(formattedAmount));
  console.log('hashedSecret  :', hashedSecret);
  console.log('hashInput     :', hashInput);

  return md5(hashInput).toUpperCase();
}

// @desc    Get payment by order
// @route   GET /api/payments/order/:orderId
// @access  Private
exports.getPaymentByOrder = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ OrderID: req.params.orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const order = await Order.findOne({ OrderID: req.params.orderId });
    if (req.user.Role === 'Customer' && order.UserID !== req.user.UserID) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
// @access  Private (Admin/Staff)
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { status, transactionId } = req.body;

    const payment = await Payment.findOne({ PaymentID: req.params.id });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.PaymentStatus = status;
    if (transactionId) payment.TransactionID = transactionId;
    if (status === 'Completed') payment.PaymentDate = Date.now();

    await payment.save();

    if (status === 'Completed') {
      await Order.findOneAndUpdate(
        { OrderID: payment.OrderID },
        { OrderStatus: 'Processing' }
      );
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin/Staff)
exports.getAllPayments = async (req, res, next) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};

    if (status) query.PaymentStatus = status;
    if (startDate || endDate) {
      query.PaymentDate = {};
      if (startDate) query.PaymentDate.$gte = new Date(startDate);
      if (endDate)   query.PaymentDate.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query).sort({ PaymentDate: -1 });

    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const order = await Order.findOne({ OrderID: payment.OrderID });
        return {
          ...payment.toObject(),
          OrderNumber: order?.OrderNumber,
          UserID:      order?.UserID
        };
      })
    );

    res.status(200).json({
      success: true,
      count: payments.length,
      payments: paymentsWithDetails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate PayHere payment
// @route   POST /api/payments/initiate
// @access  Private
exports.initiatePayment = async (req, res) => {
  console.log('🔑 SECRET BEING USED:', JSON.stringify(process.env.PAYHERE_SECRET));
  console.log('🔑 FROM CONFIG      :', JSON.stringify(config.PAYHERE_SECRET));

  try {
    const { orderId } = req.body;

    const merchantId     = (config.PAYHERE_MERCHANT_ID || '').trim();
    const merchantSecret = (config.PAYHERE_SECRET || '').trim();

    if (!merchantId || !merchantSecret) {
      return res.status(500).json({
        message: 'PayHere credentials not configured',
        debug: { merchantId, secretSet: !!merchantSecret }
      });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const user = await User.findOne({
      $or: [{ UserID: order.UserID }, { _id: order.UserID }]
    }).catch(() => null);

    let firstName = 'Customer', lastName = 'User';
    if (user?.Name) {
      const parts = user.Name.trim().split(' ');
      firstName = parts[0];
      lastName  = parts.slice(1).join(' ') || 'User';
    }

    const addressDoc = await Address.findOne({
      $or: [{ UserID: order.UserID }, { UserID: user?._id }]
    }).catch(() => null);

    const currency       = 'LKR';
    const payhereOrderId = order._id.toString();
    const amount         = order.TotalAmount || 0;

    const hash = generatePayHereHash(
      merchantId,
      payhereOrderId,
      amount,
      currency,
      merchantSecret
    );

    console.log('=== FINAL PARAMS SENT TO PAYHERE ===');
    console.log('merchant_id :', merchantId);
    console.log('order_id    :', payhereOrderId);
    console.log('amount      :', parseFloat(amount).toFixed(2));
    console.log('currency    :', currency);
    console.log('hash        :', hash);
    console.log('====================================');

    res.status(200).json({
      success: true,
      data: {
        merchant_id: merchantId,
        order_id:    payhereOrderId,
        items:       `Order ${order.OrderID || payhereOrderId}`,
        amount:      parseFloat(amount).toFixed(2),
        currency,
        hash,
        first_name:  firstName,
        last_name:   lastName,
        email:       user?.email || user?.Email || 'customer@example.com',
        phone:       addressDoc?.PhoneNumber || '0771234567',
        address:     addressDoc?.AddressLine1 || 'No Address',
        city:        addressDoc?.City || 'Colombo',
        country:     'Sri Lanka',
      }
    });

  } catch (error) {
    console.error('initiatePayment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    PayHere server-to-server payment notification
// @route   POST /api/payments/notify
// @access  Public (called by PayHere server)
exports.paymentNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id,
      method,
      status_message,
    } = req.body;

    console.log('📩 PayHere Notify received:', req.body);

    // ✅ 1. Verify signature using correct secret
    const merchantSecret = (config.PAYHERE_SECRET || '').trim();
    const hashedSecret   = md5(merchantSecret).toUpperCase();
    const localSig       = md5(
      merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret
    ).toUpperCase();

    if (localSig !== md5sig?.toUpperCase()) {
      console.warn('❌ PayHere: Invalid signature', { localSig, md5sig });
      return res.sendStatus(400);
    }

    console.log('✅ PayHere signature verified');

    // ✅ 2. Find the existing Payment record by OrderID
    // order_id here is the MongoDB _id (that's what we sent to PayHere)
    const order = await Order.findById(order_id);
    if (!order) {
      console.warn('❌ Order not found for order_id:', order_id);
      return res.sendStatus(404);
    }

    // ✅ 3. Update existing Payment record (created during order placement)
    const existingPayment = await Payment.findOne({ OrderID: order.OrderID });

    if (existingPayment) {
      // Update the existing payment record
      existingPayment.PayherePaymentID = payment_id  || '';
      existingPayment.Amount           = parseFloat(payhere_amount);
      existingPayment.Currency         = payhere_currency;
      existingPayment.StatusCode       = parseInt(status_code);
      existingPayment.Method           = method        || '';
      existingPayment.StatusMessage    = status_message || '';

      // ✅ 4. Map PayHere status_code to your PaymentStatus
      if (status_code === '2') {
        existingPayment.PaymentStatus = 'Completed';  // ← Pending → Completed
        existingPayment.PaymentDate   = new Date();
        existingPayment.PaymentMethod = method || 'Digital Wallet';
      } else if (status_code === '0') {
        existingPayment.PaymentStatus = 'Pending';
      } else if (status_code === '-1') {
        existingPayment.PaymentStatus = 'Failed';     // Cancelled by user
      } else if (status_code === '-2') {
        existingPayment.PaymentStatus = 'Failed';     // Failed
      } else if (status_code === '-3') {
        existingPayment.PaymentStatus = 'Refunded';   // Chargedback
      }

      await existingPayment.save();
      console.log('✅ Payment updated:', existingPayment.PaymentID, '→', existingPayment.PaymentStatus);
    }

    // ✅ 5. Update Order status based on payment result
    if (status_code === '2') {
      await Order.findByIdAndUpdate(order_id, {
        OrderStatus: 'Processing',   // Payment confirmed → start processing
      });
      console.log('✅ Order status → Processing for:', order.OrderID);
    } else if (status_code === '-1') {
      await Order.findByIdAndUpdate(order_id, {
        OrderStatus: 'Cancelled',
      });
      console.log('⚠️ Order cancelled:', order.OrderID);
    } else if (status_code === '-2') {
      await Order.findByIdAndUpdate(order_id, {
        OrderStatus: 'Cancelled',
      });
      console.log('❌ Order payment failed:', order.OrderID);
    }

    // ✅ PayHere expects 200 OK
    res.sendStatus(200);

  } catch (err) {
    console.error('paymentNotify error:', err);
    res.sendStatus(500);
  }
};

// @desc    Get payment status for frontend polling
// @route   GET /api/payments/status/:orderId
// @access  Private
exports.getPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const payment = await Payment.findOne({ OrderID: order.OrderID });

    res.json({
      PaymentStatus: payment?.PaymentStatus || 'Pending',
      OrderStatus:   order.OrderStatus      || 'Pending',
      OrderID:       order.OrderID,
      TotalAmount:   order.TotalAmount,
    });

  } catch (err) {
    console.error('getPaymentStatus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify payment and update status after user returns from PayHere
// @route   POST /api/payments/verify
// @access  Private
exports.verifyAndComplete = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    // 1. Find order by MongoDB _id
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // 2. Find existing payment
    const payment = await Payment.findOne({ OrderID: order.OrderID });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // 3. Update Payment → Completed
    payment.PaymentStatus = 'Completed';
    payment.PaymentDate   = new Date();
    payment.PaymentMethod = 'PayHere';
    await payment.save();

    // 4. Update Order → Processing
    order.OrderStatus = 'Processing';
    await order.save();

    console.log('✅ Payment completed for order:', order.OrderID);

    res.status(200).json({
      success:       true,
      message:       'Payment completed successfully',
      PaymentStatus: payment.PaymentStatus,
      OrderStatus:   order.OrderStatus,
      OrderID:       order.OrderID,
      TotalAmount:   order.TotalAmount,
    });

  } catch (err) {
    console.error('verifyAndComplete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
