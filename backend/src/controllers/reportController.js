const Report = require('../models/Report');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Payment = require('../models/Payment');

// @desc    Generate sales report
// @route   GET /api/reports/sales
// @access  Private (Admin/Staff)
exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, period } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.OrderDate = {};
      if (startDate) dateFilter.OrderDate.$gte = new Date(startDate);
      if (endDate) dateFilter.OrderDate.$lte = new Date(endDate);
    }

    // Get orders in date range
    const orders = await Order.find(dateFilter);
    
    // Calculate totals
    const totalSales = orders.reduce((sum, order) => sum + order.TotalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Group by date
    const salesByDate = {};
    orders.forEach(order => {
      const date = order.OrderDate.toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = {
          date,
          orders: 0,
          sales: 0
        };
      }
      salesByDate[date].orders++;
      salesByDate[date].sales += order.TotalAmount;
    });

    const report = {
      period: period || 'custom',
      startDate: startDate || 'all',
      endDate: endDate || 'all',
      summary: {
        totalSales,
        totalOrders,
        averageOrderValue,
        uniqueCustomers: new Set(orders.map(o => o.UserID)).size
      },
      dailyBreakdown: Object.values(salesByDate).sort((a, b) => a.date.localeCompare(b.date))
    };

    // Save report
    const savedReport = await Report.create({
      ReportType: 'Sales Report',
      GeneratedBy: req.user.UserID,
      Data: report
    });

    res.status(200).json({
      success: true,
      report: savedReport
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly revenue
// @route   GET /api/reports/monthly-revenue
// @access  Private (Admin/Staff)
exports.getMonthlyRevenue = async (req, res, next) => {
  try {
    const { year } = req.query;
    const targetYear = year || new Date().getFullYear();

    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31);

    const orders = await Order.find({
      OrderDate: { $gte: startDate, $lte: endDate },
      OrderStatus: { $ne: 'Cancelled' }
    });

    // Initialize monthly data
    const monthlyRevenue = Array(12).fill(0).map((_, i) => ({
      month: i + 1,
      monthName: new Date(targetYear, i, 1).toLocaleString('default', { month: 'long' }),
      revenue: 0,
      orders: 0
    }));

    // Aggregate by month
    orders.forEach(order => {
      const month = order.OrderDate.getMonth();
      monthlyRevenue[month].revenue += order.TotalAmount;
      monthlyRevenue[month].orders++;
    });

    const report = {
      year: targetYear,
      totalRevenue: monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0),
      totalOrders: orders.length,
      monthlyData: monthlyRevenue
    };

    // Save report
    const savedReport = await Report.create({
      ReportType: 'Revenue Report',
      GeneratedBy: req.user.UserID,
      Data: report
    });

    res.status(200).json({
      success: true,
      report: savedReport
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/reports/dashboard
// @access  Private (Admin/Staff)
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    // Get current date and first day of month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

    // Get counts and totals
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      monthlyOrders,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      recentPayments
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ Role: 'Customer' }),
      Order.countDocuments({ OrderDate: { $gte: firstDayOfMonth } }),
      Order.countDocuments({ OrderStatus: 'Pending' }),
      Product.countDocuments({ StockQuantity: { $lte: 10 } }),
      Order.find().sort({ OrderDate: -1 }).limit(5),
      Payment.find({ PaymentStatus: 'Pending' }).sort({ PaymentDate: -1 }).limit(5)
    ]);

    // Calculate monthly revenue
    const monthlyOrders_data = await Order.find({
      OrderDate: { $gte: firstDayOfMonth },
      OrderStatus: { $ne: 'Cancelled' }
    });
    const monthlyRevenue = monthlyOrders_data.reduce((sum, order) => sum + order.TotalAmount, 0);

    // Calculate yearly revenue
    const yearlyOrders = await Order.find({
      OrderDate: { $gte: firstDayOfYear },
      OrderStatus: { $ne: 'Cancelled' }
    });
    const yearlyRevenue = yearlyOrders.reduce((sum, order) => sum + order.TotalAmount, 0);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: { OrderStatus: { $ne: 'Cancelled' } } },
      { $lookup: {
          from: 'orderitems',
          localField: 'OrderID',
          foreignField: 'OrderID',
          as: 'items'
        }
      },
      { $unwind: '$items' },
      { $group: {
          _id: '$items.ProductID',
          totalSold: { $sum: '$items.Quantity' },
          revenue: { $sum: { $multiply: ['$items.Quantity', '$items.UnitPrice'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    const dashboard = {
      summary: {
        totalProducts,
        totalOrders,
        totalCustomers,
        monthlyRevenue,
        yearlyRevenue,
        pendingOrders,
        lowStockProducts
      },
      recentOrders,
      recentPayments,
      topProducts
    };

    res.status(200).json({
      success: true,
      dashboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private (Admin/Staff)
exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .sort({ GeneratedAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    next(error);
  }
};