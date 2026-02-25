const Address = require('../models/Address');

/**
 * @desc    Get default address of logged-in user
 * @route   GET /api/addresses/default
 * @access  Private
 */
exports.getDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      UserID: req.user.id,
      IsDefault: true
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Default address not found'
      });
    }

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Change default address
 * @route   PATCH /api/addresses/:id/set-default
 * @access  Private
 */
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Check address ownership
    const address = await Address.findOne({
      _id: addressId,
      UserID: userId
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Remove default from all addresses
    await Address.updateMany(
      { UserID: userId },
      { $set: { IsDefault: false } }
    );

    // Set selected address as default
    address.IsDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      data: address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all addresses for logged-in user
 * @route   GET /api/addresses
 * @access  Private
 */
exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ UserID: req.user.id })
      .sort({ IsDefault: -1, CreatedAt: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const addressCount = await Address.countDocuments({ UserID: userId });

    // If first address OR explicitly marked as default
    const makeDefault = addressCount === 0 || req.body.IsDefault === true;

    if (makeDefault) {
      await Address.updateMany(
        { UserID: userId },
        { $set: { IsDefault: false } }
      );
    }

    const address = await Address.create({
      ...req.body,
      UserID: userId,
      IsDefault: makeDefault
    });

    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update address
 * @route   PUT /api/addresses/:id
 * @access  Private
 */
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      UserID: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default → unset others
    if (req.body.IsDefault) {
      await Address.updateMany(
        { UserID: req.user.id },
        { $set: { IsDefault: false } }
      );
    }

    Object.assign(address, req.body);
    await address.save();

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete address
 * @route   DELETE /api/addresses/:id
 * @access  Private
 */
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      UserID: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Address removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};