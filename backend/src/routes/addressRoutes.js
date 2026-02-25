const express = require('express');
const router = express.Router();

const {
  addAddress,
  getMyAddresses,
  getDefaultAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addressController');

const { protect } = require('../middleware/auth');

// All routes are protected
router.get('/default', protect, getDefaultAddress);
router.patch('/:id/set-default', protect, setDefaultAddress);
router.get('/', protect, getMyAddresses);
router.post('/', protect, addAddress);
router.put('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);

module.exports = router;