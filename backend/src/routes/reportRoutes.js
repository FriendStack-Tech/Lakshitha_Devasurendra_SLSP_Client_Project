const express = require('express');
const router = express.Router();
const {
  getSalesReport,
  getMonthlyRevenue,
  getDashboardAnalytics,
  getAllReports
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('Admin', 'Staff'));

router.get('/', getAllReports);
router.get('/dashboard', getDashboardAnalytics);
router.get('/sales', getSalesReport);
router.get('/monthly-revenue', getMonthlyRevenue);

module.exports = router;