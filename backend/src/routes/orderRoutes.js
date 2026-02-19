const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validation');

// All routes require authentication
router.use(protect);

router.post('/', orderValidation.create, orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id/status', authorize('Admin', 'Staff'), orderController.updateOrderStatus);

module.exports = router;