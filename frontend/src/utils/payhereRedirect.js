const PAYHERE_SANDBOX_URL = 'https://sandbox.payhere.lk/pay/checkout';
const PAYHERE_LIVE_URL    = 'https://www.payhere.lk/pay/checkout';

const PAYHERE_URL = import.meta.env.VITE_PAYHERE_MODE === 'live'
  ? PAYHERE_LIVE_URL
  : PAYHERE_SANDBOX_URL;

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

export const redirectToPayhere = (params) => {
  // ✅ Step 1 — Log exactly what came back from your backend
  console.log('=== PARAMS FROM BACKEND ===');
  console.log('merchant_id :', JSON.stringify(params.merchant_id));
  console.log('order_id    :', JSON.stringify(params.order_id));
  console.log('amount      :', JSON.stringify(params.amount));
  console.log('currency    :', JSON.stringify(params.currency));
  console.log('hash        :', JSON.stringify(params.hash));
  console.log('===========================');

  const requiredFields = ['merchant_id', 'order_id', 'amount', 'currency', 'hash'];
  const missing = requiredFields.filter(f => !params[f]);
  if (missing.length > 0) {
    console.error('PayHere redirect aborted — missing fields:', missing);
    throw new Error(`PayHere params missing: ${missing.join(', ')}`);
  }

  const form = document.createElement('form');
  form.method  = 'POST';
  form.action  = PAYHERE_URL;
  form.style.display = 'none';

  const fields = {
    merchant_id: params.merchant_id,
    return_url:  `${window.location.origin}/payment/return`,
    cancel_url:  `${window.location.origin}/payment/cancel`,
    notify_url:  `${BACKEND_URL}/api/payments/notify`,
    order_id:    params.order_id,
    items:       params.items      || 'Order',
    currency:    params.currency,
    amount:      params.amount,
    first_name:  params.first_name || 'Customer',
    last_name:   params.last_name  || 'User',
    email:       params.email      || 'customer@example.com',
    phone:       params.phone      || '0771234567',
    address:     params.address    || 'No Address',
    city:        params.city       || 'Colombo',
    country:     params.country    || 'Sri Lanka',
    hash:        params.hash,
  };

  // ✅ Step 2 — Log exactly what gets put into the form fields
  console.log('=== FORM FIELDS BEING SUBMITTED ===');
  Object.entries(fields).forEach(([k, v]) => {
    console.log(`  ${k.padEnd(12)}: ${JSON.stringify(v)}`);
  });
  console.log('====================================');

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = key;
    input.value = value == null ? '' : String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);

  // ✅ Step 3 — Final check before submit
  console.log('=== SUBMITTING TO ===', PAYHERE_URL);

  form.submit();
};