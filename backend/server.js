// ✅ Import config/env.js FIRST — this triggers dotenv.config()
require('./src/config/env');

const app  = require('./src/app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Verify env vars loaded correctly on startup
  console.log('✅ PAYHERE_MERCHANT_ID:', process.env.PAYHERE_MERCHANT_ID);
  console.log('✅ PAYHERE_SECRET set :', !!process.env.PAYHERE_SECRET);
});