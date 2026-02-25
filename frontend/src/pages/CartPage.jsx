import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrash2, FiShoppingBag, FiArrowLeft, FiPlus, FiMinus,
  FiShield, FiTruck, FiRefreshCw, FiTag, FiMapPin,
  FiChevronDown, FiCheck, FiPackage, FiCreditCard,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';

const SHIPPING = 350;

/* ─────────────────────────────────────────────
   Checkout Dropdown Component
───────────────────────────────────────────── */
const CheckoutDropdown = ({ cart, onOrderConfirmed }) => {
  const [step, setStep] = useState('address'); // 'address' | 'confirm' | 'done'
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const all = await userService.getAddresses();
        setAddresses(all);
        const def = all.find(a => a.IsDefault) || all[0] || null;
        setSelectedAddress(def);
      } catch {
        toast.error('Failed to load addresses');
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  const formatAddress = (addr) => {
    if (!addr) return '';
    const parts = [
      addr.AddressLine1,
      addr.AddressLine2,
      addr.City,
      addr.District,
      addr.Province,
      addr.PostalCode,
      addr.Country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        items: cart.items.map(item => ({
          ProductID: item.ProductID,
          Quantity: item.quantity,
        })),
        shippingAddress: formatAddress(selectedAddress),
        paymentMethod: 'Cash on Delivery',
      };

      const res = await orderService.createOrder(orderData);

      // ✅ Normalize backend response safely
      const raw = res.data?.data || res.data;
      const order = raw?.order || raw;

      setPlacedOrder(order);
      setStep('done');
      onOrderConfirmed();
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <motion.div
      className="co-drop"
      initial={{ opacity: 0, y: -12, scaleY: 0.96 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -8, scaleY: 0.97 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {/* Progress Indicator */}
      <div className="co-drop__progress">
        <div className={`co-drop__step ${step === 'address' || step === 'confirm' || step === 'done' ? 'active' : ''}`}>
          <span className="co-drop__step-dot">
            {step === 'confirm' || step === 'done' ? <FiCheck size={11} /> : '1'}
          </span>
          <span>Address</span>
        </div>
        <div className="co-drop__step-line" />
        <div className={`co-drop__step ${step === 'confirm' || step === 'done' ? 'active' : ''}`}>
          <span className="co-drop__step-dot">
            {step === 'done' ? <FiCheck size={11} /> : '2'}
          </span>
          <span>Confirm</span>
        </div>
        <div className="co-drop__step-line" />
        <div className={`co-drop__step ${step === 'done' ? 'active' : ''}`}>
          <span className="co-drop__step-dot">3</span>
          <span>Payment</span>
        </div>
      </div>

      {/* ── Step 1: Address ── */}
      {step === 'address' && (
        <div className="co-drop__body">
          <h4 className="co-drop__heading">
            <FiMapPin className="co-drop__heading-icon" /> Delivery Address
          </h4>

          {loadingAddresses ? (
            <div className="co-drop__loading">
              <div className="co-drop__spinner" />
              <span>Loading addresses…</span>
            </div>
          ) : addresses.length === 0 ? (
            <div className="co-drop__no-addr">
              <p>No saved addresses found.</p>
              <Link to="/profile/addresses" className="co-drop__link">+ Add an address</Link>
            </div>
          ) : (
            <div className="co-drop__addr-list">
              {addresses.map(addr => (
                <label key={addr._id} className={`co-drop__addr-option ${selectedAddress?._id === addr._id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deliveryAddress"
                    checked={selectedAddress?._id === addr._id}
                    onChange={() => setSelectedAddress(addr)}
                  />
                  <div className="co-drop__addr-card">
                    <div className="co-drop__addr-top">
                      <span className="co-drop__addr-name">{addr.FullName}</span>
                      {addr.IsDefault && <span className="co-drop__addr-badge">Default</span>}
                    </div>
                    <span className="co-drop__addr-phone">{addr.PhoneNumber}</span>
                    <span className="co-drop__addr-text">{formatAddress(addr)}</span>
                  </div>
                  <div className="co-drop__addr-radio-dot" />
                </label>
              ))}
            </div>
          )}

          <div className="co-drop__footer">
            <Link to="/dashboard" className="co-drop__link">+ Add new address</Link>
            <button
              className="co-drop__btn co-drop__btn--primary"
              onClick={() => setStep('confirm')}
              disabled={!selectedAddress}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Confirm Order ── */}
      {step === 'confirm' && (
        <div className="co-drop__body">
          <h4 className="co-drop__heading">
            <FiPackage className="co-drop__heading-icon" /> Order Summary
          </h4>

          {/* Items preview */}
          <div className="co-drop__items-preview">
            {cart.items.map(item => (
              <div key={item.ProductID} className="co-drop__preview-item">
                <span className="co-drop__preview-name">{item.ProductName}</span>
                <span className="co-drop__preview-qty">×{item.quantity}</span>
                <span className="co-drop__preview-price">Rs. {(item.Price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="co-drop__totals">
            <div className="co-drop__total-row">
              <span>Subtotal</span>
              <span>Rs. {cart.totalAmount.toLocaleString()}</span>
            </div>
            <div className="co-drop__total-row">
              <span>Shipping</span>
              <span>Rs. {SHIPPING.toLocaleString()}</span>
            </div>
            <div className="co-drop__total-row co-drop__total-row--grand">
              <span>Total</span>
              <span>Rs. {(cart.totalAmount + SHIPPING).toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery address recap */}
          <div className="co-drop__addr-recap">
            <FiMapPin size={13} />
            <span>{formatAddress(selectedAddress)}</span>
            <button className="co-drop__change-btn" onClick={() => setStep('address')}>Change</button>
          </div>

          {/* Payment note */}
          <div className="co-drop__payment-note">
            <FiCreditCard size={13} /> Payment method: <strong>Cash on Delivery</strong>
          </div>

          <div className="co-drop__footer">
            <button className="co-drop__btn co-drop__btn--ghost" onClick={() => setStep('address')}>← Back</button>
            <button
              className="co-drop__btn co-drop__btn--confirm"
              onClick={handleConfirmOrder}
              disabled={placingOrder}
            >
              {placingOrder ? (
                <><div className="co-drop__btn-spinner" /> Placing…</>
              ) : (
                'Confirm Order'
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Done / Payment ── */}
      {step === 'done' && (
        <div className="co-drop__body co-drop__body--done">
          <div className="co-drop__success-icon">
            <FiCheck size={28} />
          </div>
          <h4 className="co-drop__success-title">Order Placed!</h4>
          {/* {placedOrder && (
            <p className="co-drop__success-id">
              Order ID: <strong>{placedOrder._id || placedOrder.OrderID || '—'}</strong>
            </p>
          )} */}

          <p className="co-drop__success-id">
            Order ID:{' '}
            <strong>
              {placedOrder?.OrderID || placedOrder?.OrderNumber || 'Pending'}
            </strong>
          </p>

          <p className="co-drop__success-sub">
            Your order has been confirmed. Proceed to payment below.
          </p>
          <button
            className="co-drop__btn co-drop__btn--pay"
            onClick={() => {
              // TODO: integrate payment gateway in next phase
              toast('Payment gateway coming soon!', { icon: '💳' });
            }}
          >
            <FiCreditCard /> Proceed to Payment
          </button>
        </div>
      )}

      <style>{`
        .co-drop {
          background: #fff;
          border: 1.5px solid rgba(200,135,42,0.18);
          border-radius: 18px;
          box-shadow: 0 12px 40px rgba(26,18,8,0.13);
          margin-top: 10px;
          overflow: hidden;
          transform-origin: top center;
        }

        /* Progress */
        .co-drop__progress {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 16px 24px;
          background: linear-gradient(135deg, #fdf8f0, #fdf3e3);
          border-bottom: 1px solid rgba(200,135,42,0.1);
        }
        .co-drop__step {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #c0a080;
          transition: color 0.2s;
        }
        .co-drop__step.active { color: #A06820; }
        .co-drop__step-dot {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(200,135,42,0.15);
          border: 1.5px solid rgba(200,135,42,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.68rem;
          font-weight: 800;
          color: #c0a080;
          transition: all 0.2s;
        }
        .co-drop__step.active .co-drop__step-dot {
          background: #C8872A;
          border-color: #C8872A;
          color: #fff;
        }
        .co-drop__step-line {
          flex: 1;
          height: 1.5px;
          background: rgba(200,135,42,0.2);
          margin: 0 8px;
        }

        /* Body */
        .co-drop__body { padding: 20px 24px; }
        .co-drop__body--done {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 32px 24px;
        }

        .co-drop__heading {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: Georgia, serif;
          font-size: 1rem;
          color: #1A1208;
          margin: 0 0 16px;
        }
        .co-drop__heading-icon { color: #C8872A; }

        /* Loading */
        .co-drop__loading {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 0;
          color: #a08060;
          font-size: 0.85rem;
        }
        .co-drop__spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(200,135,42,0.2);
          border-top-color: #C8872A;
          border-radius: 50%;
          animation: co-spin 0.7s linear infinite;
        }
        @keyframes co-spin { to { transform: rotate(360deg); } }

        /* Address list */
        .co-drop__addr-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
          max-height: 220px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .co-drop__addr-list::-webkit-scrollbar { width: 4px; }
        .co-drop__addr-list::-webkit-scrollbar-track { background: #fdf8f0; border-radius: 4px; }
        .co-drop__addr-list::-webkit-scrollbar-thumb { background: rgba(200,135,42,0.3); border-radius: 4px; }

        .co-drop__addr-option {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 13px 15px;
          border-radius: 12px;
          border: 1.5px solid rgba(200,135,42,0.15);
          cursor: pointer;
          transition: all 0.18s;
          background: #fdf9f4;
          position: relative;
        }
        .co-drop__addr-option input[type="radio"] { display: none; }
        .co-drop__addr-option:hover { border-color: rgba(200,135,42,0.4); background: #fdf5ea; }
        .co-drop__addr-option.selected {
          border-color: #C8872A;
          background: #fff8ee;
          box-shadow: 0 0 0 3px rgba(200,135,42,0.08);
        }

        .co-drop__addr-card { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .co-drop__addr-top { display: flex; align-items: center; gap: 8px; }
        .co-drop__addr-name { font-weight: 700; font-size: 0.88rem; color: #1A1208; }
        .co-drop__addr-badge {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: rgba(200,135,42,0.15);
          color: #A06820;
          padding: 2px 7px;
          border-radius: 50px;
          border: 1px solid rgba(200,135,42,0.25);
        }
        .co-drop__addr-phone { font-size: 0.78rem; color: #a08060; }
        .co-drop__addr-text { font-size: 0.78rem; color: #8a7055; line-height: 1.4; margin-top: 2px; }

        .co-drop__addr-radio-dot {
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(200,135,42,0.3);
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.18s;
          display: flex; align-items: center; justify-content: center;
        }
        .co-drop__addr-option.selected .co-drop__addr-radio-dot {
          border-color: #C8872A;
          background: #C8872A;
          box-shadow: inset 0 0 0 3px #fff;
        }

        /* No address */
        .co-drop__no-addr { text-align: center; padding: 16px 0; color: #a08060; font-size: 0.88rem; }

        /* Items preview */
        .co-drop__items-preview {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 14px;
          max-height: 160px;
          overflow-y: auto;
          padding: 12px;
          background: #fdf9f4;
          border-radius: 10px;
          border: 1px solid rgba(200,135,42,0.1);
        }
        .co-drop__items-preview::-webkit-scrollbar { width: 3px; }
        .co-drop__items-preview::-webkit-scrollbar-thumb { background: rgba(200,135,42,0.3); border-radius: 3px; }
        .co-drop__preview-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #5a4030;
        }
        .co-drop__preview-name { flex: 1; font-weight: 600; }
        .co-drop__preview-qty { color: #a08060; }
        .co-drop__preview-price { font-weight: 700; color: #A06820; font-family: Georgia, serif; }

        /* Totals */
        .co-drop__totals {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 14px;
        }
        .co-drop__total-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #8a7055;
        }
        .co-drop__total-row--grand {
          font-size: 1rem;
          font-weight: 800;
          color: #1A1208;
          padding-top: 10px;
          border-top: 1.5px solid rgba(200,135,42,0.15);
          margin-top: 4px;
        }
        .co-drop__total-row--grand span:last-child { color: #A06820; font-family: Georgia, serif; }

        /* Address recap */
        .co-drop__addr-recap {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          font-size: 0.78rem;
          color: #8a7055;
          background: #fdf9f4;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(200,135,42,0.1);
          margin-bottom: 10px;
        }
        .co-drop__addr-recap svg { flex-shrink: 0; margin-top: 1px; color: #C8872A; }
        .co-drop__addr-recap span { flex: 1; line-height: 1.4; }
        .co-drop__change-btn {
          background: none; border: none; cursor: pointer;
          color: #C8872A; font-size: 0.75rem; font-weight: 700;
          white-space: nowrap; font-family: sans-serif;
          text-decoration: underline;
        }

        /* Payment note */
        .co-drop__payment-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #a08060;
          margin-bottom: 14px;
        }
        .co-drop__payment-note strong { color: #5a4030; }
        .co-drop__payment-note svg { color: #C8872A; }

        /* Footer */
        .co-drop__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(200,135,42,0.1);
          gap: 10px;
        }

        /* Links */
        .co-drop__link {
          font-size: 0.8rem;
          font-weight: 700;
          color: #C8872A;
          text-decoration: none;
        }
        .co-drop__link:hover { text-decoration: underline; }

        /* Buttons */
        .co-drop__btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          font-family: sans-serif;
          transition: all 0.2s;
        }
        .co-drop__btn--primary {
          background: linear-gradient(135deg, #C8872A, #A06820);
          color: #fff;
          box-shadow: 0 4px 14px rgba(200,135,42,0.35);
          margin-left: auto;
        }
        .co-drop__btn--primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(200,135,42,0.45); }
        .co-drop__btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .co-drop__btn--ghost {
          background: none;
          color: #a08060;
          border: 1.5px solid rgba(200,135,42,0.2);
        }
        .co-drop__btn--ghost:hover { background: #fdf5ea; color: #A06820; }

        .co-drop__btn--confirm {
          background: linear-gradient(135deg, #2e8b57, #1e6b3f);
          color: #fff;
          box-shadow: 0 4px 14px rgba(46,139,87,0.35);
          flex: 1;
        }
        .co-drop__btn--confirm:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(46,139,87,0.45); }
        .co-drop__btn--confirm:disabled { opacity: 0.6; cursor: not-allowed; }

        .co-drop__btn--pay {
          background: linear-gradient(135deg, #C8872A, #A06820);
          color: #fff;
          padding: 13px 28px;
          border-radius: 50px;
          box-shadow: 0 6px 22px rgba(200,135,42,0.4);
          font-size: 0.95rem;
        }
        .co-drop__btn--pay:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(200,135,42,0.5); }

        .co-drop__btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: co-spin 0.7s linear infinite;
        }

        /* Success */
        .co-drop__success-icon {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2e8b57, #1e6b3f);
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          box-shadow: 0 6px 20px rgba(46,139,87,0.35);
          margin-bottom: 4px;
        }
        .co-drop__success-title {
          font-family: Georgia, serif;
          font-size: 1.25rem;
          color: #1A1208;
          margin: 0;
        }
        .co-drop__success-id { font-size: 0.78rem; color: #a08060; margin: 0; }
        .co-drop__success-sub { font-size: 0.82rem; color: #8a7055; margin: 0 0 8px; line-height: 1.5; }
      `}</style>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Main CartPage Component
───────────────────────────────────────────── */
const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCheckoutOpen(false);
      }
    };
    if (checkoutOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [checkoutOpen]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      return;
    }
    setCheckoutOpen(prev => !prev);
  };

  const handleOrderConfirmed = () => {
    clearCart();
    // Keep dropdown open to show payment button (step=done)
  };

  /* ── Empty State ── */
  if (cart.items.length === 0 && !checkoutOpen) {
    return (
      <div className="ct-empty">
        <motion.div
          className="ct-empty__card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="ct-empty__icon">
            <FiShoppingBag />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any spices yet!</p>
          <Link to="/shop" className="ct-btn ct-btn--primary">
            Continue Shopping
          </Link>
          <Link to="/" className="ct-empty__home">← Back to Home</Link>
        </motion.div>

        <style>{`
          .ct-empty {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            background: #f9f4ec;
            font-family: sans-serif;
          }
          .ct-empty__card {
            background: #fff;
            border-radius: 24px;
            padding: 60px 48px;
            text-align: center;
            box-shadow: 0 8px 40px rgba(26,18,8,0.08);
            border: 1px solid rgba(200,135,42,0.1);
            max-width: 400px;
            width: 100%;
          }
          .ct-empty__icon {
            width: 88px; height: 88px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #fdf3e3, #f5e5cc);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 2.2rem; color: #C8872A;
            border: 2px dashed rgba(200,135,42,0.3);
          }
          .ct-empty__card h2 { font-family: Georgia, serif; font-size: 1.6rem; color: #1A1208; margin-bottom: 10px; }
          .ct-empty__card p { color: #8a7055; margin-bottom: 28px; line-height: 1.6; }
          .ct-empty__home { display: block; margin-top: 14px; color: #a08060; font-size: 0.85rem; text-decoration: none; }
          .ct-empty__home:hover { color: #C8872A; }
          .ct-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 28px; border-radius: 50px; font-size: 0.92rem; font-weight: 700; text-decoration: none; cursor: pointer; border: none; font-family: sans-serif; transition: all 0.22s; }
          .ct-btn--primary { background: linear-gradient(135deg, #C8872A, #A06820); color: #fff; box-shadow: 0 4px 16px rgba(200,135,42,0.35); }
          .ct-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 7px 22px rgba(200,135,42,0.45); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ct">

      {/* ── Page Header ── */}
      <div className="ct__header">
        <div className="ct__container ct__header-inner">
          <div>
            <span className="ct__eyebrow">✦ Your Selection</span>
            <h1>Shopping Cart</h1>
          </div>
          <span className="ct__item-count">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="ct__container ct__body">
        <div className="ct__layout">

          {/* ── Cart Items ── */}
          <div className="ct__items-col">
            <div className="ct__items-card">
              <AnimatePresence>
                {cart.items.map((item, i) => (
                  <motion.div
                    key={item.ProductID}
                    className="ct__item"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, padding: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <div className="ct__item-img">
                      <img
                        src={item.ImageURL || '/default-product.jpg'}
                        alt={item.ProductName}
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                      <div className="ct__item-img-fallback">🌶️</div>
                    </div>
                    <div className="ct__item-details">
                      <span className="ct__item-cat">{item.Category || 'Spice'}</span>
                      <h3 className="ct__item-name">{item.ProductName}</h3>
                      <span className="ct__item-unit-price">Rs. {Number(item.Price).toLocaleString()} each</span>
                    </div>
                    <div className="ct__qty">
                      <button className="ct__qty-btn" onClick={() => updateQuantity(item.ProductID, item.quantity - 1, item.ProductName)}><FiMinus /></button>
                      <span className="ct__qty-val">{item.quantity}</span>
                      <button className="ct__qty-btn" onClick={() => updateQuantity(item.ProductID, item.quantity + 1, item.ProductName)}><FiPlus /></button>
                    </div>
                    <div className="ct__item-total">Rs. {(item.Price * item.quantity).toLocaleString()}</div>
                    <button className="ct__remove" onClick={() => removeFromCart(item.ProductID, item.ProductName)} aria-label="Remove item"><FiTrash2 /></button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="ct__items-footer">
              <Link to="/shop" className="ct__back-link"><FiArrowLeft /> Continue Shopping</Link>
              <button className="ct__clear-btn" onClick={clearCart}><FiTrash2 /> Clear Cart</button>
            </div>

            <div className="ct__trust">
              {[
                { icon: <FiShield />, text: 'Secure Checkout' },
                { icon: <FiTruck />, text: 'Fast Shipping' },
                { icon: <FiRefreshCw />, text: '30-Day Returns' },
              ].map((b, i) => (
                <div key={i} className="ct__trust-item">
                  <span className="ct__trust-icon">{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Order Summary + Checkout Dropdown ── */}
          <div className="ct__summary-col" ref={dropdownRef}>
            <div className="ct__summary-card">
              <h2 className="ct__summary-title">Order Summary</h2>

              <div className="ct__summary-rows">
                <div className="ct__summary-row">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>Rs. {cart.totalAmount.toLocaleString()}</span>
                </div>
                <div className="ct__summary-row">
                  <span>Shipping</span>
                  <span>Rs. {SHIPPING.toLocaleString()}</span>
                </div>
                <div className="ct__summary-row ct__summary-row--total">
                  <span>Total</span>
                  <span>Rs. {(cart.totalAmount + SHIPPING).toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="ct__coupon">
                <FiTag className="ct__coupon-icon" />
                <input type="text" placeholder="Promo code" className="ct__coupon-input" />
                <button className="ct__coupon-btn">Apply</button>
              </div>

              <motion.button
                className={`ct__checkout-btn ${checkoutOpen ? 'ct__checkout-btn--open' : ''}`}
                onClick={handleCheckout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {checkoutOpen ? (
                  <><FiChevronDown className="ct__checkout-chevron ct__checkout-chevron--up" /> Close Checkout</>
                ) : (
                  <>Proceed to Checkout <FiChevronDown className="ct__checkout-chevron" /></>
                )}
              </motion.button>

              {/* Checkout Dropdown */}
              <AnimatePresence>
                {checkoutOpen && (
                  <CheckoutDropdown
                    cart={cart}
                    onOrderConfirmed={handleOrderConfirmed}
                  />
                )}
              </AnimatePresence>

              {!isAuthenticated && (
                <p className="ct__auth-note">
                  <Link to="/login">Login</Link> or <Link to="/register">register</Link> to complete your order
                </p>
              )}

              <div className="ct__summary-note">
                <FiShield /> Payments are 100% secure & encrypted
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .ct {
          --amber: #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --dark: #1A1208;
          --cream: #FDF8F0;
          min-height: 100vh;
          background: #f9f4ec;
          font-family: sans-serif;
        }

        .ct__container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        /* ── Header ── */
        .ct__header {
          background: linear-gradient(135deg, #1A1208 0%, #3D2B0F 100%);
          padding: 40px 0 32px;
        }
        .ct__header-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }
        .ct__eyebrow {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--amber-l);
          font-weight: 600;
          margin-bottom: 6px;
        }
        .ct__header h1 {
          font-family: Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: #fff;
          margin: 0;
        }
        .ct__item-count {
          background: rgba(200,135,42,0.2);
          border: 1px solid rgba(200,135,42,0.35);
          color: var(--amber-l);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 50px;
          white-space: nowrap;
        }

        /* ── Body ── */
        .ct__body { padding: 36px 24px 72px; }
        .ct__layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: start;
        }

        /* ── Items Card ── */
        .ct__items-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(200,135,42,0.1);
          box-shadow: 0 4px 20px rgba(26,18,8,0.06);
          margin-bottom: 16px;
        }

        .ct__item {
          display: grid;
          grid-template-columns: 88px 1fr auto auto auto;
          gap: 18px;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(200,135,42,0.08);
          transition: background 0.2s;
        }
        .ct__item:last-child { border-bottom: none; }
        .ct__item:hover { background: #fdf9f4; }

        .ct__item-img {
          width: 88px; height: 88px;
          border-radius: 14px;
          overflow: hidden;
          background: linear-gradient(135deg, #fdf3e3, #f5e5cc);
          flex-shrink: 0;
          position: relative;
        }
        .ct__item-img img { width: 100%; height: 100%; object-fit: cover; }
        .ct__item-img-fallback {
          display: none;
          position: absolute; inset: 0;
          align-items: center; justify-content: center;
          font-size: 1.8rem;
        }

        .ct__item-cat {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--amber);
          display: block;
          margin-bottom: 4px;
        }
        .ct__item-name {
          font-family: Georgia, serif;
          font-size: 1rem;
          color: var(--dark);
          margin: 0 0 5px;
          line-height: 1.3;
        }
        .ct__item-unit-price { font-size: 0.78rem; color: #a08060; }

        /* Qty stepper */
        .ct__qty {
          display: flex;
          align-items: center;
          background: #f9f4ec;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 50px;
          overflow: hidden;
        }
        .ct__qty-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer;
          color: #8a7055; font-size: 0.85rem;
          transition: all 0.2s;
        }
        .ct__qty-btn:hover { background: var(--amber); color: #fff; }
        .ct__qty-val {
          min-width: 32px;
          text-align: center;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--dark);
        }

        .ct__item-total {
          font-weight: 800;
          font-size: 1rem;
          color: var(--amber-d);
          font-family: Georgia, serif;
          white-space: nowrap;
          text-align: right;
        }

        .ct__remove {
          background: none; border: none; cursor: pointer;
          color: #c0a090; font-size: 1rem;
          padding: 8px; border-radius: 8px;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .ct__remove:hover { color: #e74c3c; background: rgba(231,76,60,0.08); }

        /* Footer row */
        .ct__items-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0 16px;
        }
        .ct__back-link {
          display: flex; align-items: center; gap: 7px;
          color: var(--amber-d); text-decoration: none;
          font-size: 0.88rem; font-weight: 600;
          transition: gap 0.2s;
        }
        .ct__back-link:hover { gap: 10px; }
        .ct__clear-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          color: #c0a090; font-size: 0.85rem; font-weight: 600;
          transition: color 0.2s; font-family: sans-serif;
        }
        .ct__clear-btn:hover { color: #e74c3c; }

        /* Trust badges */
        .ct__trust {
          display: flex;
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(200,135,42,0.1);
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(26,18,8,0.04);
        }
        .ct__trust-item {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 6px;
          padding: 16px 10px;
          font-size: 0.75rem; font-weight: 600; color: #8a7055;
          border-right: 1px solid rgba(200,135,42,0.08);
          text-align: center;
        }
        .ct__trust-item:last-child { border-right: none; }
        .ct__trust-icon { font-size: 1.1rem; color: var(--amber); }

        /* ── Summary Card ── */
        .ct__summary-card {
          background: #fff;
          border-radius: 20px;
          padding: 28px;
          border: 1px solid rgba(200,135,42,0.12);
          box-shadow: 0 4px 20px rgba(26,18,8,0.07);
          position: sticky;
          top: 88px;
        }
        .ct__summary-title {
          font-family: Georgia, serif;
          font-size: 1.3rem;
          color: var(--dark);
          margin-bottom: 22px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(200,135,42,0.12);
        }

        .ct__summary-rows { margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px; }
        .ct__summary-row {
          display: flex; justify-content: space-between;
          align-items: center; font-size: 0.9rem; color: #8a7055;
        }
        .ct__summary-row--total {
          font-size: 1.1rem; font-weight: 800; color: var(--dark);
          padding-top: 16px;
          border-top: 1.5px solid rgba(200,135,42,0.15);
          margin-top: 4px;
        }
        .ct__summary-row--total span:last-child { color: var(--amber-d); font-family: Georgia, serif; }

        /* Coupon */
        .ct__coupon {
          display: flex; align-items: center;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 12px; overflow: hidden;
          margin-bottom: 18px; background: #fdf8f0;
        }
        .ct__coupon-icon { color: var(--amber); margin: 0 10px; font-size: 0.95rem; flex-shrink: 0; }
        .ct__coupon-input {
          flex: 1; border: none; background: none;
          padding: 11px 4px; font-size: 0.88rem;
          color: var(--dark); outline: none; font-family: sans-serif;
        }
        .ct__coupon-input::placeholder { color: #b0956e; }
        .ct__coupon-btn {
          padding: 11px 16px; background: var(--amber); color: #fff;
          border: none; cursor: pointer; font-size: 0.82rem; font-weight: 700;
          transition: background 0.2s; font-family: sans-serif;
        }
        .ct__coupon-btn:hover { background: var(--amber-d); }

        /* Checkout button */
        .ct__checkout-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--amber), var(--amber-d));
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 22px rgba(200,135,42,0.4);
          margin-bottom: 0;
          font-family: sans-serif;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: box-shadow 0.2s;
        }
        .ct__checkout-btn--open {
          background: linear-gradient(135deg, #8a6030, #6a4820);
          box-shadow: 0 4px 14px rgba(100,70,20,0.35);
          border-radius: 14px 14px 0 0;
        }
        .ct__checkout-chevron {
          transition: transform 0.25s ease;
          font-size: 1rem;
        }
        .ct__checkout-chevron--up {
          transform: rotate(180deg);
        }

        .ct__auth-note {
          text-align: center; font-size: 0.82rem;
          color: #a08060; margin-top: 14px;
        }
        .ct__auth-note a { color: var(--amber-d); font-weight: 700; text-decoration: none; }
        .ct__auth-note a:hover { text-decoration: underline; }

        .ct__summary-note {
          display: flex; align-items: center; justify-content: center;
          gap: 7px; font-size: 0.78rem; color: #b0956e;
          padding-top: 14px; border-top: 1px solid rgba(200,135,42,0.1);
          margin-top: 14px;
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .ct__layout { grid-template-columns: 1fr; }
          .ct__summary-card { position: static; }
        }
        @media (max-width: 640px) {
          .ct__item { grid-template-columns: 72px 1fr auto; gap: 12px; }
          .ct__item-total { grid-column: 2; font-size: 0.9rem; }
          .ct__remove { grid-column: 3; grid-row: 1; }
          .ct__qty { grid-column: 1 / -1; justify-self: start; }
          .ct__header-inner { flex-direction: column; align-items: flex-start; }
          .ct__trust { flex-direction: column; }
          .ct__trust-item {
            border-right: none;
            border-bottom: 1px solid rgba(200,135,42,0.08);
            flex-direction: row; justify-content: flex-start;
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;