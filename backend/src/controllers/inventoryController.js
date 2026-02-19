const InventoryTransaction = require('../models/InventoryTransaction');
const Product = require('../models/Product');

// @desc    Get inventory transactions
// @route   GET /api/inventory/transactions
// @access  Private (Admin/Staff)
exports.getTransactions = async (req, res, next) => {
  try {
    const { productId, startDate, endDate, type } = req.query;
    let query = {};

    if (productId) {
      query.ProductID = productId;
    }

    if (type) {
      query.TransactionType = type;
    }

    if (startDate || endDate) {
      query.TransactionDate = {};
      if (startDate) query.TransactionDate.$gte = new Date(startDate);
      if (endDate) query.TransactionDate.$lte = new Date(endDate);
    }

    const transactions = await InventoryTransaction.find(query)
      .sort({ TransactionDate: -1 });

    // Get product details for each transaction
    const transactionsWithDetails = await Promise.all(
      transactions.map(async (transaction) => {
        const product = await Product.findOne({ ProductID: transaction.ProductID });
        return {
          ...transaction.toObject(),
          ProductName: product?.ProductName
        };
      })
    );

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions: transactionsWithDetails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create inventory transaction
// @route   POST /api/inventory/transactions
// @access  Private (Admin/Staff)
exports.createTransaction = async (req, res, next) => {
  try {
    const { ProductID, TransactionType, QuantityChanged, Remarks } = req.body;

    const product = await Product.findOne({ ProductID });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let newStock = product.StockQuantity;

    if (['Stock In', 'Return'].includes(TransactionType)) {
      newStock += QuantityChanged;
    } else if (['Stock Out', 'Sale'].includes(TransactionType)) {
      if (product.StockQuantity < QuantityChanged) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }
      newStock -= QuantityChanged;
    } else if (TransactionType === 'Adjustment') {
      newStock = QuantityChanged;
    }

    await Product.updateOne(
      { ProductID },
      { StockQuantity: newStock }
    );

    const transaction = await InventoryTransaction.create({
      ProductID,
      TransactionType,
      QuantityChanged:
        TransactionType === 'Adjustment'
          ? newStock - product.StockQuantity
          : QuantityChanged,
      Remarks
    });

    res.status(201).json({
      success: true,
      transaction,
      NewStock: newStock
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory report
// @route   GET /api/inventory/report
// @access  Private (Admin/Staff)
exports.getInventoryReport = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ StockQuantity: 1 });

    const report = {
      totalProducts: products.length,
      totalStockValue: products.reduce((sum, p) => sum + (p.Price * p.StockQuantity), 0),
      lowStock: products.filter(p => p.StockQuantity <= 10).length,
      outOfStock: products.filter(p => p.StockQuantity === 0).length,
      categories: {},
      products: products.map(p => ({
        ProductID: p.ProductID,
        ProductName: p.ProductName,
        Category: p.Category,
        Price: p.Price,
        StockQuantity: p.StockQuantity,
        StockValue: p.Price * p.StockQuantity
      }))
    };

    // Group by category
    products.forEach(product => {
      if (!report.categories[product.Category]) {
        report.categories[product.Category] = {
          count: 0,
          stockValue: 0
        };
      }
      report.categories[product.Category].count++;
      report.categories[product.Category].stockValue += product.Price * product.StockQuantity;
    });

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};