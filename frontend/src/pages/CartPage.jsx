import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiPlus, FiMinus, FiShield, FiTruck, FiRefreshCw, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SHIPPING = 350;

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      return;
    }
    window.location.href = '/checkout';
  };

  /* ── Empty State ── */
  if (cart.items.length === 0) {
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
                    {/* Image */}
                    <div className="ct__item-img">
                      <img
                        src={item.ImageURL || '/default-product.jpg'}
                        alt={item.ProductName}
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                      <div className="ct__item-img-fallback">🌶️</div>
                    </div>

                    {/* Details */}
                    <div className="ct__item-details">
                      <span className="ct__item-cat">{item.Category || 'Spice'}</span>
                      <h3 className="ct__item-name">{item.ProductName}</h3>
                      <span className="ct__item-unit-price">Rs. {Number(item.Price).toLocaleString()} each</span>
                    </div>

                    {/* Quantity stepper */}
                    <div className="ct__qty">
                      <button
                        className="ct__qty-btn"
                        onClick={() => updateQuantity(item.ProductID, item.quantity - 1, item.ProductName)}
                      >
                        <FiMinus />
                      </button>
                      <span className="ct__qty-val">{item.quantity}</span>
                      <button
                        className="ct__qty-btn"
                        onClick={() => updateQuantity(item.ProductID, item.quantity + 1, item.ProductName)}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="ct__item-total">
                      Rs. {(item.Price * item.quantity).toLocaleString()}
                    </div>

                    {/* Remove */}
                    <button
                      className="ct__remove"
                      onClick={() => removeFromCart(item.ProductID, item.ProductName)}
                      aria-label="Remove item"
                    >
                      <FiTrash2 />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom actions */}
            <div className="ct__items-footer">
              <Link to="/shop" className="ct__back-link">
                <FiArrowLeft /> Continue Shopping
              </Link>
              <button className="ct__clear-btn" onClick={clearCart}>
                <FiTrash2 /> Clear Cart
              </button>
            </div>

            {/* Trust badges */}
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

          {/* ── Order Summary ── */}
          <div className="ct__summary-col">
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
                <input
                  type="text"
                  placeholder="Promo code"
                  className="ct__coupon-input"
                />
                <button className="ct__coupon-btn">Apply</button>
              </div>

              <motion.button
                className="ct__checkout-btn"
                onClick={handleCheckout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout →
              </motion.button>

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
        .ct__item-unit-price {
          font-size: 0.78rem;
          color: #a08060;
        }

        /* Qty stepper */
        .ct__qty {
          display: flex;
          align-items: center;
          gap: 0;
          background: #f9f4ec;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 50px;
          overflow: hidden;
        }
        .ct__qty-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer;
          color: #8a7055;
          font-size: 0.85rem;
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
          color: #c0a090;
          font-size: 1rem;
          padding: 8px;
          border-radius: 8px;
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
          color: var(--amber-d);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          transition: gap 0.2s;
        }
        .ct__back-link:hover { gap: 10px; }
        .ct__clear-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          color: #c0a090;
          font-size: 0.85rem;
          font-weight: 600;
          transition: color 0.2s;
          font-family: sans-serif;
        }
        .ct__clear-btn:hover { color: #e74c3c; }

        /* Trust badges */
        .ct__trust {
          display: flex;
          gap: 0;
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(200,135,42,0.1);
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(26,18,8,0.04);
        }
        .ct__trust-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 16px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #8a7055;
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #8a7055;
        }
        .ct__summary-row--total {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--dark);
          padding-top: 16px;
          border-top: 1.5px solid rgba(200,135,42,0.15);
          margin-top: 4px;
        }
        .ct__summary-row--total span:last-child { color: var(--amber-d); font-family: Georgia, serif; }

        /* Coupon */
        .ct__coupon {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 18px;
          background: #fdf8f0;
        }
        .ct__coupon-icon { color: var(--amber); margin: 0 10px; font-size: 0.95rem; flex-shrink: 0; }
        .ct__coupon-input {
          flex: 1;
          border: none;
          background: none;
          padding: 11px 4px;
          font-size: 0.88rem;
          color: var(--dark);
          outline: none;
          font-family: sans-serif;
        }
        .ct__coupon-input::placeholder { color: #b0956e; }
        .ct__coupon-btn {
          padding: 11px 16px;
          background: var(--amber);
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 700;
          transition: background 0.2s;
          font-family: sans-serif;
        }
        .ct__coupon-btn:hover { background: var(--amber-d); }

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
          margin-bottom: 14px;
          font-family: sans-serif;
          letter-spacing: 0.3px;
        }

        .ct__auth-note {
          text-align: center;
          font-size: 0.82rem;
          color: #a08060;
          margin-bottom: 14px;
        }
        .ct__auth-note a { color: var(--amber-d); font-weight: 700; text-decoration: none; }
        .ct__auth-note a:hover { text-decoration: underline; }

        .ct__summary-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 0.78rem;
          color: #b0956e;
          padding-top: 14px;
          border-top: 1px solid rgba(200,135,42,0.1);
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
          .ct__trust-item { border-right: none; border-bottom: 1px solid rgba(200,135,42,0.08); flex-direction: row; justify-content: flex-start; padding: 12px 16px; }
        }
      `}</style>
    </div>
  );
};

export default CartPage;