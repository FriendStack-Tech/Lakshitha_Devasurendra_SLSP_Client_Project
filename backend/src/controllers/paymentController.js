const Payment = require('../models/Payment');
const Order = require('../models/Order');

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

    // Check authorization
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
    if (transactionId) {
      payment.TransactionID = transactionId;
    }
    if (status === 'Completed') {
      payment.PaymentDate = Date.now();
    }

    await payment.save();

    // Update order status if payment completed
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

    if (status) {
      query.PaymentStatus = status;
    }

    if (startDate || endDate) {
      query.PaymentDate = {};
      if (startDate) query.PaymentDate.$gte = new Date(startDate);
      if (endDate) query.PaymentDate.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query).sort({ PaymentDate: -1 });

    // Get order details for each payment
    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const order = await Order.findOne({ OrderID: payment.OrderID });
        return {
          ...payment.toObject(),
          OrderNumber: order?.OrderNumber,
          UserID: order?.UserID
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