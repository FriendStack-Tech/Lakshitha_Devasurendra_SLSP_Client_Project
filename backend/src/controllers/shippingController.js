const ShippingDetail = require('../models/ShippingDetail');
const Order = require('../models/Order');

// @desc    Get shipping by order
// @route   GET /api/shipping/order/:orderId
// @access  Private
exports.getShippingByOrder = async (req, res, next) => {
  try {
    const shipping = await ShippingDetail.findOne({ OrderID: req.params.orderId });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: 'Shipping details not found'
      });
    }

    // Check authorization
    const order = await Order.findOne({ OrderID: req.params.orderId });
    if (req.user.Role === 'Customer' && order.UserID !== req.user.UserID) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this shipping information'
      });
    }

    res.status(200).json({
      success: true,
      shipping
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shipping status
// @route   PUT /api/shipping/:id/status
// @access  Private (Admin/Staff)
exports.updateShippingStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, courierService } = req.body;

    const shipping = await ShippingDetail.findOne({ ShippingID: req.params.id });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: 'Shipping details not found'
      });
    }

    if (trackingNumber) {
      shipping.TrackingNumber = trackingNumber;
    }
    if (courierService) {
      shipping.CourierService = courierService;
    }
    shipping.ShippingStatus = status;

    await shipping.save();

    // Update order status based on shipping status
    if (status === 'Shipped' || status === 'In Transit') {
      await Order.findOneAndUpdate(
        { OrderID: shipping.OrderID },
        { OrderStatus: 'Shipped' }
      );
    } else if (status === 'Delivered') {
      await Order.findOneAndUpdate(
        { OrderID: shipping.OrderID },
        { OrderStatus: 'Delivered' }
      );
    }

    res.status(200).json({
      success: true,
      shipping
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all shipments
// @route   GET /api/shipping
// @access  Private (Admin/Staff)
exports.getAllShipments = async (req, res, next) => {
  try {
    const { status, country } = req.query;
    let query = {};

    if (status) {
      query.ShippingStatus = status;
    }
    if (country) {
      query.Country = country;
    }

    const shipments = await ShippingDetail.find(query).sort({ _id: -1 });

    // Get order details for each shipment
    const shipmentsWithDetails = await Promise.all(
      shipments.map(async (shipment) => {
        const order = await Order.findOne({ OrderID: shipment.OrderID });
        return {
          ...shipment.toObject(),
          OrderNumber: order?.OrderNumber,
          UserID: order?.UserID
        };
      })
    );

    res.status(200).json({
      success: true,
      count: shipments.length,
      shipments: shipmentsWithDetails
    });
  } catch (error) {
    next(error);
  }
};