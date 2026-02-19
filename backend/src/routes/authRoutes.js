const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');

router.post('/register', userValidation.register, register);
router.post('/login', userValidation.login, login);
router.get('/me', protect, getMe);

module.exports = router;