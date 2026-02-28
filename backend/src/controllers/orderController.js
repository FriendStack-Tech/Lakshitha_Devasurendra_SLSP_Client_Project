const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const Payment = require('../models/Payment');
const ShippingDetail = require('../models/ShippingDetail');

const SHIPPING_FEE = 350;

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // 1️⃣ Validate products & stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findOne({ ProductID: item.ProductID });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.ProductID} not found`
        });
      }

      if (product.StockQuantity < item.Quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.ProductName}`
        });
      }

      validatedItems.push({
        ...item,
        UnitPrice: product.Price
      });

      subtotal += product.Price * item.Quantity;
    }

    // ✅ Total = subtotal + shipping
    const totalAmount = subtotal + SHIPPING_FEE;

    // 2️⃣ Create Order
    const order = await Order.create({
      UserID: req.user.UserID,
      SubTotal: subtotal,          // ✅ Store subtotal separately
      ShippingFee: SHIPPING_FEE,   // ✅ Store shipping separately
      TotalAmount: totalAmount     // ✅ Store full total (used for PayHere hash)
    });

    // 3️⃣ Create order items + update stock + inventory log
    for (const item of validatedItems) {
      await OrderItem.create({
        OrderID: order.OrderID,
        ProductID: item.ProductID,
        Quantity: item.Quantity,
        UnitPrice: item.UnitPrice
      });

      await Product.updateOne(
        { ProductID: item.ProductID },
        { $inc: { StockQuantity: -item.Quantity } }
      );

      await InventoryTransaction.create({
        ProductID: item.ProductID,
        TransactionType: 'Sale',
        QuantityChanged: item.Quantity,
        Remarks: `Order ${order.OrderNumber}`
      });
    }

    // 4️⃣ Payment record
    await Payment.create({
      OrderID: order.OrderID,
      PaymentMethod: paymentMethod || 'Cash on Delivery',
      Amount: totalAmount,        // ✅ Full amount including shipping
      Currency: 'LKR',
      PaymentStatus: 'Pending'
    });

    // 5️⃣ Shipping details
    await ShippingDetail.create({
      OrderID: order.OrderID,
      ShippingAddress: shippingAddress,
      Country: 'Sri Lanka',
      ShippingStatus: 'Pending'
    });

    // 6️⃣ Return full order details
    const orderDetails = await exports.getOrderDetails(order.OrderID);

    res.status(201).json({
      success: true,
      data: {                      // ✅ Wrapped in data to match frontend: res.data.data
        order: orderDetails
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.Role === 'Customer') {
      query.UserID = req.user.UserID;
    }

    const orders = await Order.find(query).sort({ OrderDate: -1 });

    const ordersWithDetails = await Promise.all(
      orders.map(order => exports.getOrderDetails(order.OrderID))
    );

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: ordersWithDetails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ OrderID: req.params.id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (req.user.Role === 'Customer' && order.UserID !== req.user.UserID) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    const orderDetails = await exports.getOrderDetails(order.OrderID);

    res.status(200).json({
      success: true,
      order: orderDetails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Staff)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findOne({ OrderID: req.params.id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.OrderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// Helper: get complete order details
exports.getOrderDetails = async function (orderId) {
  const order    = await Order.findOne({ OrderID: orderId });
  const items    = await OrderItem.find({ OrderID: orderId });
  const payment  = await Payment.findOne({ OrderID: orderId });
  const shipping = await ShippingDetail.findOne({ OrderID: orderId });

  const itemsWithDetails = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findOne({ ProductID: item.ProductID });
      return {
        ...item.toObject(),
        ProductName:  product?.ProductName,
        ProductImage: product?.ImageURL
      };
    })
  );

  return {
    ...order.toObject(),
    items,
    itemsWithDetails,
    payment,
    shipping
  };
};