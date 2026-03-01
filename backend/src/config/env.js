const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  NODE_ENV:   process.env.NODE_ENV  || 'development',
  PORT:       process.env.PORT      || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,

  // ✅ Add PayHere vars explicitly
  PAYHERE_MERCHANT_ID: process.env.PAYHERE_MERCHANT_ID,
  PAYHERE_SECRET:      process.env.PAYHERE_SECRET,
  PAYHERE_MODE:        process.env.PAYHERE_MODE || 'sandbox',
};