const express = require('express');
const router = express.Router();
const {
  getShippingByOrder,
  updateShippingStatus,
  getAllShipments
} = require('../controllers/shippingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('Admin', 'Staff'), getAllShipments);
router.get('/order/:orderId', getShippingByOrder);
router.put('/:id/status', authorize('Admin', 'Staff'), updateShippingStatus);

module.exports = router;